
import { uniqueId } from 'lodash';

import {
  IconCopy, IconLayoutDashboard, IconMoodHappy, IconTypography,
  IconAward,
  IconBoxMultiple,
  IconPoint,
  IconAlertCircle,
  IconNotes,
  IconCalendar,
  IconMail,
  IconTicket,
  IconEdit,
  IconCurrencyDollar,
  IconApps,
  IconFileDescription,
  IconFileDots,
  IconFiles,
  IconBan,
  IconStar,
  IconMoodSmile,
  IconBorderAll,
  IconBorderHorizontal,
  IconBorderInner,
  IconBorderVertical,
  IconBorderTop,
  IconUserCircle,
  IconPackage,
  IconMessage2,
  IconBasket,
  IconChartLine,
  IconChartArcs,
  IconChartCandle,
  IconChartArea,
  IconChartDots,
  IconChartDonut3,
  IconChartRadar,
  IconLogin,
  IconUserPlus,
  IconRotate,
  IconBox,
  IconShoppingCart,
  IconAperture,
  IconLayout,
  IconSettings,
  IconHelp,
  IconZoomCode,
  IconBoxAlignBottom,
  IconBoxAlignLeft,
  IconBorderStyle2,
  IconAppWindow,
  IconNotebook,
  IconFileCheck,
  IconChartHistogram,
  IconChartPie2,
  IconChartScatter,
  IconChartPpf,
  IconChartArcs3,
  IconListTree,
  IconLayoutSidebar,
  IconLock,
} from '@tabler/icons-react';


const Menuitems = [
  {
    navlabel: true,
    subheader: 'Home',
  },

  {
    id: uniqueId(),
    title: 'Dashboard',
    icon: IconLayoutDashboard,
    href: '/dashboard',
  },
  {
    navlabel: true,
    subheader: 'Utilities',
  },
  {
    id: uniqueId(),
    title: 'Typography',
    icon: IconTypography,
    href: '/ui/typography',
  },
  {
    id: uniqueId(),
    title: 'Shadow',
    icon: IconCopy,
    href: '/ui/shadow',
  },

  {
    navlabel: true,
    subheader: 'Extra',
  },
  {
    id: uniqueId(),
    title: 'Icons',
    icon: IconMoodHappy,
    href: '/icons',
  },
  {
    id: uniqueId(),
    title: 'Sample Page',
    icon: IconAperture,
    href: '/sample-page',
  },
  
];

export default Menuitems;
