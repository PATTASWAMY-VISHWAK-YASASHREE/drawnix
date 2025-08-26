import React, { useState } from 'react';
import { ToolButton } from '../../tool-button';
import classNames from 'classnames';
import { getSelectedElements, PlaitBoard } from '@plait/core';
import { LinkIcon } from '../../icons';
import { useDrawnix } from '../../../hooks/use-drawnix';
import { getFirstTextEditor, LinkElement } from '@plait/common';
import { ReactEditor } from 'slate-react';
import { LinkEditor } from '@plait/text-plugins';
import { useI18n } from '../../../utils/i18n';

export type PopupLinkButtonProps = {
  board: PlaitBoard;
  title: string;
};

export const PopupLinkButton: React.FC<PopupLinkButtonProps> = ({
  board,
  title,
}) => {
  const { appState, setAppState } = useDrawnix();
  const { t } = useI18n();
  return (
    <ToolButton
      className={classNames(`property-button`)}
      visible={true}
      icon={LinkIcon}
      type="button"
      title={title}
      aria-label={title}
      onPointerUp={() => {
        const pbElement = getSelectedElements(board)[0];
        const editor = getFirstTextEditor(pbElement);
        const linkElementEntry = LinkEditor.getLinkElement(editor);
        if (!linkElementEntry) {
          LinkEditor.wrapLink(editor, t('link.default'), '');
        }
        setTimeout(() => {
          const linkElementEntry = LinkEditor.getLinkElement(editor);
          const linkElement = linkElementEntry[0] as LinkElement;
          const targetDom = ReactEditor.toDOMNode(editor, linkElement);
          setAppState({
            ...appState,
            linkState: {
              editor,
              targetDom: targetDom,
              targetElement: linkElement,
              isEditing: true,
              isHovering: false,
              isHoveringOrigin: false,
            },
          });
        }, 0);
      }}
    ></ToolButton>
  );
};
