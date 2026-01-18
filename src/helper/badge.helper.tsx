import Badge from '@/components/ui/badge/Badge';
import React from 'react';

type UserRole = 'ADMIN' | 'FAN' | 'IDOL';

const ROLE_BADGE_CONFIG: Record<
  UserRole,
  {
    label: string;
    color: React.ComponentProps<typeof Badge>['color'];
    variant?: React.ComponentProps<typeof Badge>['variant'];
  }
> = {
  ADMIN: {
    label: 'Admin',
    color: 'error',
    variant: 'light',
  },
  FAN: {
    label: 'Fan',
    color: 'warning',
  },
  IDOL: {
    label: 'Idol',
    color: 'success',
  },
};

export const renderRoleBadge = (role: string) => {
  const config = ROLE_BADGE_CONFIG[role as UserRole];

  if (!config) {
    return (
      <Badge size="sm" color="light">
        {role}
      </Badge>
    );
  }

  return (
    <Badge size="sm" color={config.color} variant={config.variant ?? 'light'}>
      {config.label}
    </Badge>
  );
};
