import { usePage } from '@inertiajs/react';

export default function hasAnyPermission(permissions) {
    const { auth } = usePage().props;
    const allPermissions = auth.permissions;

    return permissions.some(permission => allPermissions[permission]);
}
