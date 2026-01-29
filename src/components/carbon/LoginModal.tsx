import { ComposedModal, ModalHeader, ModalBody } from "@carbon/react";

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function LoginModal({ open, onOpenChange }: LoginModalProps) {
  return (
    <ComposedModal
      open={open}
      onClose={() => onOpenChange(false)}
      size="sm"
    >
      <ModalHeader>
        <h3>Login</h3>
      </ModalHeader>
      <ModalBody>
        <p>Please use the authentication system to log in.</p>
      </ModalBody>
    </ComposedModal>
  );
}