'use client';

import { Input } from '@the-monkeys/ui/atoms/input';
import { Label } from '@the-monkeys/ui/atoms/label';

import { CardContact } from '../types';

export interface ContactFieldsProps {
  contact: CardContact;
  onChange: (patch: Partial<CardContact>) => void;
}

const Field = ({
  id,
  label,
  value,
  placeholder,
  maxLength,
  type = 'text',
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  placeholder?: string;
  maxLength?: number;
  type?: string;
  onChange: (v: string) => void;
}) => (
  <div className='flex flex-col gap-1'>
    <Label htmlFor={id} className='text-xs'>
      {label}
    </Label>
    <Input
      id={id}
      type={type}
      value={value}
      placeholder={placeholder}
      maxLength={maxLength}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

export const ContactFields = ({ contact, onChange }: ContactFieldsProps) => (
  <div className='flex flex-col gap-3'>
    <div className='grid grid-cols-2 gap-3'>
      <Field
        id='card-first-name'
        label='First Name *'
        value={contact.firstName}
        placeholder='John'
        maxLength={50}
        onChange={(v) => onChange({ firstName: v })}
      />
      <Field
        id='card-last-name'
        label='Last Name *'
        value={contact.lastName}
        placeholder='Doe'
        maxLength={50}
        onChange={(v) => onChange({ lastName: v })}
      />
    </div>
    <Field
      id='card-job-title'
      label='Job Title'
      value={contact.jobTitle ?? ''}
      placeholder='Senior Software Engineer'
      maxLength={80}
      onChange={(v) => onChange({ jobTitle: v })}
    />
    <div className='grid grid-cols-2 gap-3'>
      <Field
        id='card-company'
        label='Company'
        value={contact.company ?? ''}
        placeholder='Acme Inc.'
        maxLength={80}
        onChange={(v) => onChange({ company: v })}
      />
      <Field
        id='card-department'
        label='Department'
        value={contact.department ?? ''}
        placeholder='Engineering'
        maxLength={60}
        onChange={(v) => onChange({ department: v })}
      />
    </div>
    <Field
      id='card-email'
      label='Email'
      type='email'
      value={contact.email ?? ''}
      placeholder='john@company.com'
      maxLength={120}
      onChange={(v) => onChange({ email: v })}
    />
    <Field
      id='card-phone'
      label='Phone'
      type='tel'
      value={contact.phone ?? ''}
      placeholder='+1 (555) 123-4567'
      maxLength={30}
      onChange={(v) => onChange({ phone: v })}
    />
    <Field
      id='card-website'
      label='Website'
      type='url'
      value={contact.website ?? ''}
      placeholder='https://yoursite.com'
      maxLength={200}
      onChange={(v) => onChange({ website: v })}
    />
  </div>
);
