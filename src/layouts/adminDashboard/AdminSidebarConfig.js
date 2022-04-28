import { Icon } from '@iconify/react';
import gridOutline from '@iconify/icons-eva/grid-outline';
import archiveOutline from '@iconify/icons-eva/archive-outline';
import peopleOutline from '@iconify/icons-eva/people-outline';
import creditCardOutline from '@iconify/icons-eva/credit-card-outline';
// ----------------------------------------------------------------------

const getIcon = (name) => <Icon icon={name} width={22} height={22} />;

const adminSidebarConfig = [
    {
        title: 'dashboard',
        path: '/adminDashboard/admin',
        icon: getIcon(gridOutline)
    },
    {
        title: 'licenses',
        path: '/adminDashboard/licences',
        icon: getIcon(archiveOutline)
    },
    {
        title: 'users',
        path: '/adminDashboard/users',
        icon: getIcon(peopleOutline)
    },
    {
        title: 'balance tracking',
        path: '/adminDashboard/balanceTracking',
        icon: getIcon(creditCardOutline)
    }
];

export default adminSidebarConfig;
