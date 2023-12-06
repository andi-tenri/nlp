import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';

import Iconify from 'src/components/iconify';
import { deleteProduct } from 'src/services/product-service';

// ----------------------------------------------------------------------

export default function ShopProductCard(props) {
  const { product } = props;

  const renderImg = (
    <Box
      component="img"
      alt={product.name}
      src={product.cover}
      sx={{
        top: 0,
        width: 1,
        height: 1,
        objectFit: 'cover',
        position: 'absolute',
      }}
    />
  );

  const handleProductEdit = () => {
    props.handleProductEdit(product);
  };

  const handleProductRemove = () => {
    deleteProduct(product.name);
    props.refresh()
  };

  return (
    <Card>
      <Box sx={{ pt: '100%', position: 'relative' }}>
        {renderImg}
        <Box sx={{ position: 'absolute', top: 14, right: 14, zIndex: 9 }}>
          <Button
            onClick={handleProductEdit}
            variant="contained"
            size="x-small"
            color="inherit"
            sx={{ px: 0, py: 1, minWidth: 40, mr: 1 }}
          >
            <Iconify icon="eva:edit-fill" sx={{ width: 14, height: 14 }} />
          </Button>

          <Button
            onClick={handleProductRemove}
            variant="contained"
            size="x-small"
            color="secondary"
            sx={{ px: 0, py: 1, minWidth: 40 }}
          >
            <Iconify icon="eva:trash-2-outline" sx={{ width: 14, height: 14 }} />
          </Button>
        </Box>
      </Box>

      <Stack spacing={2} sx={{ p: 3 }}>
        <Link color="inherit" underline="hover" variant="subtitle2" noWrap>
          {product.name}
        </Link>
      </Stack>
    </Card>
  );
}

ShopProductCard.propTypes = {
  product: PropTypes.object,
  handleProductEdit: PropTypes.func,
  refresh: PropTypes.func
};
