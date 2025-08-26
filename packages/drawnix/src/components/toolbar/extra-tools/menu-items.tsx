import MenuItem from '../../menu/menu-item';
import { useI18n } from '../../../utils/i18n';
import { MarkdownLogoIcon, MermaidLogoIcon } from '../../icons';
import { DialogType, useDrawnix } from '../../../hooks/use-drawnix';

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
      aria-label={t('extra.mermaidToDrawnix')}
    >{t('extra.mermaidToDrawnix')}</MenuItem>
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
      aria-label={t('extra.markdownToDrawnix')}
    >{t('extra.markdownToDrawnix')}</MenuItem>
  );
};

MermaidToDrawnixItem.displayName = 'MarkdownToDrawnix';
