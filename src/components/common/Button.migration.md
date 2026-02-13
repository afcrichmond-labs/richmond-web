# LegacyButton -> Design System Button Migration

## Prop Mapping
| LegacyButton | @richmond/design-system/Button |
|---|---|
| type="primary" | variant="primary" |
| type="secondary" | variant="secondary" |
| type="danger" | variant="destructive" |
| onClick | onPress |
| disabled | isDisabled |
| loading | isLoading |

## Files Migrated (23 of 47 instances)
- [x] src/components/checkout/CheckoutButton.tsx
- [x] src/components/auth/LoginForm.tsx
- [x] src/components/auth/SignupForm.tsx
- [x] src/components/settings/SaveButton.tsx
- [x] src/components/common/ConfirmDialog.tsx
- [ ] src/components/admin/legacy-reports/* (3 instances - blocked by jQuery removal #14)
- [ ] ... 21 more files remaining

## Status: In Progress
Tracking 47 total instances. 23 migrated, 24 remaining.
