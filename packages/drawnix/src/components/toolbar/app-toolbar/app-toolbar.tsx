import { useBoard } from '@plait-board/react-board';
import Stack from '../../stack';
import { ToolButton } from '../../tool-button';
import {
  DuplicateIcon,
  MenuIcon,
  RedoIcon,
  TrashIcon,
  UndoIcon,
} from '../../icons';
import classNames from 'classnames';
import {
  ATTACHED_ELEMENT_CLASS_NAME,
  deleteFragment,
  duplicateElements,
  getSelectedElements,
  PlaitBoard,
} from '@plait/core';
import { Island } from '../../island';
import { Popover, PopoverContent, PopoverTrigger } from '../../popover/popover';
import { useState } from 'react';
import { CleanBoard, OpenFile, SaveAsImage, SaveToFile, Socials } from './app-menu-items';
import Menu from '../../menu/menu';
import MenuSeparator from '../../menu/menu-separator';
import MenuItem from '../../menu/menu-item';
import { useI18n } from '../../../utils/i18n';

export const AppToolbar = () => {
  const board = useBoard();
  const container = PlaitBoard.getBoardContainer(board);
  const selectedElements = getSelectedElements(board);
  const [appMenuOpen, setAppMenuOpen] = useState(false);
  const { t, locale, setLocale } = useI18n();
  const isUndoDisabled = board.history.undos.length <= 0;
  const isRedoDisabled = board.history.redos.length <= 0;
  return (
    <Island
      padding={1}
      className={classNames('app-toolbar', ATTACHED_ELEMENT_CLASS_NAME)}
    >
      <Stack.Row gap={1}>
        <Popover
          key={0}
          sideOffset={12}
          open={appMenuOpen}
          onOpenChange={(open) => {
            setAppMenuOpen(open);
          }}
          placement="bottom-start"
        >
          <PopoverTrigger asChild>
            <ToolButton
              type="icon"
              visible={true}
              selected={appMenuOpen}
              icon={MenuIcon}
              title={t('app.menu')}
              aria-label={t('app.menu')}
              onPointerDown={() => {
                setAppMenuOpen(!appMenuOpen);
              }}
            />
          </PopoverTrigger>
          <PopoverContent container={container}>
            <Menu
              onSelect={() => {
                setAppMenuOpen(false);
              }}
            >
              <OpenFile></OpenFile>
              <SaveToFile></SaveToFile>
              <SaveAsImage></SaveAsImage>
              <CleanBoard></CleanBoard>
              <MenuSeparator />
              <MenuItem
                onSelect={() => {
                  setLocale(locale === 'en' ? 'zh' : 'en');
                }}
                aria-label={t('lang.selector')}
              >
                {locale === 'en' ? t('lang.zh') : t('lang.en')}
              </MenuItem>
              <MenuSeparator />
              <Socials />
            </Menu>
          </PopoverContent>
        </Popover>
        <ToolButton
          key={1}
          type="icon"
          icon={UndoIcon}
          visible={true}
          title={t('toolbar.undo')}
          aria-label={t('toolbar.undo')}
          onPointerUp={() => {
            board.undo();
          }}
          disabled={isUndoDisabled}
        />
        <ToolButton
          key={2}
          type="icon"
          icon={RedoIcon}
          visible={true}
          title={t('toolbar.redo')}
          aria-label={t('toolbar.redo')}
          onPointerUp={() => {
            board.redo();
          }}
          disabled={isRedoDisabled}
        />
        {selectedElements.length > 0 && (
          <ToolButton
            className="duplicate"
            key={3}
            type="icon"
            icon={DuplicateIcon}
            visible={true}
            title={t('toolbar.duplicate')}
            aria-label={t('toolbar.duplicate')}
            onPointerUp={() => {
              duplicateElements(board);
            }}
          />
        )}
        {selectedElements.length > 0 && (
          <ToolButton
            className="trash"
            key={4}
            type="icon"
            icon={TrashIcon}
            visible={true}
            title={t('toolbar.trash')}
            aria-label={t('toolbar.trash')}
            onPointerUp={() => {
              deleteFragment(board);
            }}
          />
        )}
        
      </Stack.Row>
    </Island>
  );
};
