import SvgColor from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const navConfig = [
  {
    title: 'dashboard',
    path: '/',
    icon: icon('ic_analytics'),
  },
  {
    title: 'device',
    path: '/device',
    icon: icon('ic_device'),
  },
  {
    title: 'dataset',
    path: '/dataset',
    icon: icon('ic_dataset'),
  }
];

export default navConfig;
