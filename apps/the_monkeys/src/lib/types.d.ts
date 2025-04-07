import { NextComponentType, NextPageContext } from 'next';
import { Router } from 'next/router';

export type VerificationStatus =
  | 'Unverified'
  | 'Verification link sent'
  | 'Verified';
