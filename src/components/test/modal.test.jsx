import { test, expect, vi } from 'vitest'
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom/vitest'
import { Modal, ModalTitle } from '../Modal'
import { log } from 'console'

test('modal title', async () => {
  render(<ModalTitle titleData = {{text:"Title" }} />);

  const title = screen.getByText('Title');
  
  expect(title).toBeDefined();
})

test('modal with title, subtitle and close button', async () => {
  const modalContent = <>
    <Modal.Title titleData={{text:"Modal Title"}} />
    <Modal.SubTitle subtitleData={{text:"Modal Sub Title"}} />

    <input data-testid='input1' value='' />
    <input />
    <select>
      <option value="1">1</option>
      <option value="2">2</option>
      <option value="3">3</option>
    </select>
  </>

  let modal = null;

  const closeModal = vi.fn(() => {
    modal.style = {visibility:'hidden'};
  });

  const { container } = render(
    <Modal closeCallback={closeModal}>
      {modalContent}
    </Modal>
  );

  modal = container.querySelector(".modal");
  expect(modal).toBeDefined();

  const title = screen.getByText('Modal Title');
  expect(title).toBeDefined();

  const subtitle = screen.getByText('Modal Sub Title');
  expect(subtitle).toBeDefined();

  const btn = container.querySelector(".fa-close");
  expect(btn).toBeDefined();
   
  await userEvent.click(btn);

  expect(closeModal).toBeCalled();
})

