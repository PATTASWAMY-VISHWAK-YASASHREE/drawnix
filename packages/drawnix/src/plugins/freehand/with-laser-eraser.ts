import {
  PlaitBoard,
  Point,
  PlaitElement,
  getHitElementByPoint,
  Transforms,
  toViewBoxPoint,
  toHostPoint,
  PlaitPointerType,
} from '@plait/core';
import { FreehandShape } from './type';

const ERASER_TOLERANCE = 15; // Pixel tolerance for eraser detection

export const withLaserEraser = (board: PlaitBoard) => {
  const { pointerDown, pointerMove, pointerUp } = board;
  
  let isErasing = false;
  let erasedElements = new Set<string>();
  let laserTrail: Point[] = [];
  
  const isEraserMode = () => {
    return PlaitBoard.isPointer(board, FreehandShape.laserEraser);
  };

  const getElementsInEraserPath = (point: Point): PlaitElement[] => {
    const elements: PlaitElement[] = [];
    const viewBoxPoint = toViewBoxPoint(board, toHostPoint(board, point[0], point[1]));
    
    // Check for elements at the exact point
    const hitElement = getHitElementByPoint(board, viewBoxPoint);
    if (hitElement && !erasedElements.has(hitElement.id)) {
      elements.push(hitElement);
    }
    
    // Check for elements in the vicinity of the eraser
    for (let dx = -ERASER_TOLERANCE; dx <= ERASER_TOLERANCE; dx += 5) {
      for (let dy = -ERASER_TOLERANCE; dy <= ERASER_TOLERANCE; dy += 5) {
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

  const createLaserEffect = (point: Point) => {
    // Add laser visual effect
    laserTrail.push(point);
    if (laserTrail.length > 10) {
      laserTrail.shift(); // Keep only recent points for trail effect
    }
    
    // Create laser beam visual effect
    const laserBeam = document.createElement('div');
    laserBeam.className = 'laser-beam';
    laserBeam.style.cssText = `
      position: absolute;
      width: 3px;
      height: 20px;
      background: linear-gradient(90deg, #ff0000 0%, #ff4500 50%, #ffff00 100%);
      border-radius: 1px;
      box-shadow: 0 0 10px #ff0000, 0 0 20px #ff0000, 0 0 30px #ff0000;
      pointer-events: none;
      z-index: 1000;
      animation: laserGlow 0.2s ease-out;
      left: ${point[0]}px;
      top: ${point[1]}px;
      transform: translate(-50%, -50%);
    `;
    
    const container = PlaitBoard.getBoardContainer(board);
    if (container) {
      container.appendChild(laserBeam);
      
      // Remove the laser effect after animation
      setTimeout(() => {
        if (laserBeam.parentNode) {
          laserBeam.parentNode.removeChild(laserBeam);
        }
      }, 200);
    }
  };

  board.pointerDown = (event: PointerEvent) => {
    if (isEraserMode()) {
      isErasing = true;
      erasedElements.clear();
      laserTrail = [];
      
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
    
    pointerMove(event);
  };

  board.pointerUp = (event: PointerEvent) => {
    if (isErasing && isEraserMode()) {
      isErasing = false;
      erasedElements.clear();
      laserTrail = [];
      return;
    }
    
    pointerUp(event);
  };

  return board;
};

// Add CSS for laser effect animation
const addLaserStyles = () => {
  if (document.getElementById('laser-eraser-styles')) return;
  
  const style = document.createElement('style');
  style.id = 'laser-eraser-styles';
  style.textContent = `
    @keyframes laserGlow {
      0% {
        opacity: 1;
        transform: translate(-50%, -50%) scale(0.5);
      }
      50% {
        opacity: 0.8;
        transform: translate(-50%, -50%) scale(1.2);
      }
      100% {
        opacity: 0;
        transform: translate(-50%, -50%) scale(1);
      }
    }
    
    .laser-beam {
      animation: laserGlow 0.2s ease-out forwards;
    }
  `;
  document.head.appendChild(style);
};

// Initialize laser styles when module loads
addLaserStyles();