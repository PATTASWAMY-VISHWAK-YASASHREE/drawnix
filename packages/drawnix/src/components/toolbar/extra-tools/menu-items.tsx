import MenuItem from '../../menu/menu-item';
import { MarkdownLogoIcon, MermaidLogoIcon, EraserIcon } from '../../icons';
import { DialogType, useDrawnix, useSetPointer } from '../../../hooks/use-drawnix';
import { useI18n } from '../../../i18n';
import { FreehandShape } from '../../../plugins/freehand/type';
import { PlaitBoard, BoardTransforms } from '@plait/core';
import { useBoard } from '@plait-board/react-board';

export const MermaidToDrawnixItem = () => {
  const { appState, setAppState } = useDrawnix();
  const { t } = useI18n();
  return (
    <MenuItem
      data-testid="marmaid-to-drawnix-button"
      onSelect={() => {
        setAppState({
          ...appState,
          openDialogType: DialogType.mermaidToDrawnix,
        });
      }}
      icon={MermaidLogoIcon}
      aria-label={t('extraTools.mermaidToDrawnix')}
    >
      {t('extraTools.mermaidToDrawnix')}
    </MenuItem>
  );
};

MermaidToDrawnixItem.displayName = 'MermaidToDrawnix';

export const MarkdownToDrawnixItem = () => {
  const { appState, setAppState } = useDrawnix();
  const { t } = useI18n();
  return (
    <MenuItem
      data-testid="markdown-to-drawnix-button"
      onSelect={() => {
        setAppState({
          ...appState,
          openDialogType: DialogType.markdownToDrawnix,
        });
      }}
      icon={MarkdownLogoIcon}
      aria-label={t('extraTools.markdownToDrawnix')}
    >
      {t('extraTools.markdownToDrawnix')}
    </MenuItem>
  );
};

MarkdownToDrawnixItem.displayName = 'MarkdownToDrawnix';

export const LaserEraserItem = () => {
  const board = useBoard();
  const setPointer = useSetPointer();
  const { t } = useI18n();
  
  return (
    <MenuItem
      data-testid="laser-eraser-button"
      onSelect={() => {
        BoardTransforms.updatePointerType(board, FreehandShape.laserEraser);
        setPointer(FreehandShape.laserEraser);
      }}
      icon={EraserIcon}
      aria-label={t('extraTools.laserEraser')}
    >
      {t('extraTools.laserEraser')}
    </MenuItem>
  );
};

LaserEraserItem.displayName = 'LaserEraser';
