import { useState } from 'react';

export default function useUpdateProfile() {
  const [open, setOpen] = useState(false);

  const toggleOpen = (value?: boolean) => setOpen(value ?? true);

  return {
    open,
    toggleOpen,
  };
}
