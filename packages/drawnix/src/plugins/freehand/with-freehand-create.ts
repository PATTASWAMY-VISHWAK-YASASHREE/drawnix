import {
  PlaitBoard,
  Point,
  Transforms,
  distanceBetweenPointAndPoint,
  toHostPoint,
  toViewBoxPoint,
  getHitElementByPoint,
  PlaitElement,
} from '@plait/core';
import { isDrawingMode } from '@plait/common';
import { createFreehandElement, getFreehandPointers } from './utils';
import { Freehand, FreehandShape } from './type';
import { FreehandGenerator } from './freehand.generator';
import { FreehandSmoother } from './smoother';

export const withFreehandCreate = (board: PlaitBoard) => {
  const { pointerDown, pointerMove, pointerUp, globalPointerUp } = board;

  let isDrawing = false;
  let isErasing = false;
  let erasedElements = new Set<string>();

  let isSnappingStartAndEnd = false;

  let points: Point[] = [];

  let originScreenPoint: Point | null = null;

  const generator = new FreehandGenerator(board);

  const smoother = new FreehandSmoother({
    smoothing: 0.7,
    pressureSensitivity: 0.6,
  });

  let temporaryElement: Freehand | null = null;

  const ERASER_TOLERANCE = 15;

  const createLaserEffect = (point: Point) => {
    const laserBeam = document.createElement('div');
    laserBeam.className = 'laser-beam';
    laserBeam.style.cssText = `
      position: fixed;
      width: 3px;
      height: 20px;
      background: linear-gradient(90deg, #ff0000 0%, #ff4500 50%, #ffff00 100%);
      border-radius: 1px;
      box-shadow: 0 0 10px #ff0000, 0 0 20px #ff0000, 0 0 30px #ff0000;
      pointer-events: none;
      z-index: 1000;
      left: ${point[0]}px;
      top: ${point[1]}px;
      transform: translate(-50%, -50%);
      animation: laserGlow 0.2s ease-out forwards;
    `;
    
    document.body.appendChild(laserBeam);
    
    setTimeout(() => {
      if (laserBeam.parentNode) {
        laserBeam.parentNode.removeChild(laserBeam);
      }
    }, 200);
  };

  const getElementsInEraserPath = (point: Point): PlaitElement[] => {
    const elements: PlaitElement[] = [];
    const viewBoxPoint = toViewBoxPoint(board, toHostPoint(board, point[0], point[1]));
    
    const hitElement = getHitElementByPoint(board, viewBoxPoint);
    if (hitElement && !erasedElements.has(hitElement.id)) {
      elements.push(hitElement);
    }
    
    for (let dx = -ERASER_TOLERANCE; dx <= ERASER_TOLERANCE; dx += 8) {
      for (let dy = -ERASER_TOLERANCE; dy <= ERASER_TOLERANCE; dy += 8) {
        const testPoint: Point = [point[0] + dx, point[1] + dy];
        const testViewBoxPoint = toViewBoxPoint(board, toHostPoint(board, testPoint[0], testPoint[1]));
        const testHitElement = getHitElementByPoint(board, testViewBoxPoint);
        
        if (testHitElement && !erasedElements.has(testHitElement.id) && 
            !elements.find(el => el.id === testHitElement.id)) {
          elements.push(testHitElement);
        }
      }
    }
    
    return elements;
  };

  const isEraserMode = () => {
    return PlaitBoard.isPointer(board, FreehandShape.laserEraser);
  };

  const complete = (cancel?: boolean) => {
    if (isDrawing) {
      const pointer = PlaitBoard.getPointer(board) as FreehandShape;
      if (isSnappingStartAndEnd) {
        points.push(points[0]);
      }
      temporaryElement = createFreehandElement(pointer, points);
    }
    if (temporaryElement && !cancel) {
      Transforms.insertNode(board, temporaryElement, [board.children.length]);
    }
    generator?.destroy();
    temporaryElement = null;
    isDrawing = false;
    isErasing = false;
    erasedElements.clear();
    points = [];
    smoother.reset();
  };

  board.pointerDown = (event: PointerEvent) => {
    const freehandPointers = getFreehandPointers();
    const isFreehandPointer = PlaitBoard.isInPointer(board, freehandPointers);
    
    if (isFreehandPointer && isDrawingMode(board)) {
      if (isEraserMode()) {
        // Handle laser eraser mode
        isErasing = true;
        erasedElements.clear();
        
        const point: Point = [event.x, event.y];
        createLaserEffect(point);
        
        const elementsToErase = getElementsInEraserPath(point);
        elementsToErase.forEach(element => {
          erasedElements.add(element.id);
          const path = board.children.findIndex(child => child.id === element.id);
          if (path !== -1) {
            Transforms.removeNode(board, [path]);
          }
        });
        return;
      } else {
        // Handle normal drawing mode
        isDrawing = true;
        originScreenPoint = [event.x, event.y];
        const smoothingPoint = smoother.process(originScreenPoint) as Point;
        const point = toViewBoxPoint(
          board,
          toHostPoint(board, smoothingPoint[0], smoothingPoint[1])
        );
        points.push(point);
      }
    }
    pointerDown(event);
  };

  board.pointerMove = (event: PointerEvent) => {
    if (isErasing && isEraserMode()) {
      const point: Point = [event.x, event.y];
      createLaserEffect(point);
      
      const elementsToErase = getElementsInEraserPath(point);
      elementsToErase.forEach(element => {
        if (!erasedElements.has(element.id)) {
          erasedElements.add(element.id);
          const path = board.children.findIndex(child => child.id === element.id);
          if (path !== -1) {
            Transforms.removeNode(board, [path]);
          }
        }
      });
      return;
    }
    
    if (isDrawing) {
      const currentScreenPoint: Point = [event.x, event.y];
      if (
        originScreenPoint &&
        distanceBetweenPointAndPoint(
          originScreenPoint[0],
          originScreenPoint[1],
          currentScreenPoint[0],
          currentScreenPoint[1]
        ) < 8
      ) {
        isSnappingStartAndEnd = true;
      } else {
        isSnappingStartAndEnd = false;
      }
      const smoothingPoint = smoother.process(currentScreenPoint);
      if (smoothingPoint) {
        generator?.destroy();
        const newPoint = toViewBoxPoint(
          board,
          toHostPoint(board, smoothingPoint[0], smoothingPoint[1])
        );
        points.push(newPoint);
        const pointer = PlaitBoard.getPointer(board) as FreehandShape;
        temporaryElement = createFreehandElement(pointer, points);
        generator.processDrawing(
          temporaryElement,
          PlaitBoard.getElementTopHost(board)
        );
      }
      return;
    }

    pointerMove(event);
  };

  board.pointerUp = (event: PointerEvent) => {
    complete();
    pointerUp(event);
  };

  board.globalPointerUp = (event: PointerEvent) => {
    complete(true);
    globalPointerUp(event);
  };

  return board;
};
