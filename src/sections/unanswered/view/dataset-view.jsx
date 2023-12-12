import { useEffect, useReducer, useState } from 'react';

import LoadingButton from '@mui/lab/LoadingButton';
import {
  Box,
  Button,
  Card,
  Container,
  Grid,
  Stack,
  Table,
  TableBody,
  TableContainer,
  TablePagination,
  Typography,
  IconButton,
  TextField,
  InputAdornment,
} from '@mui/material';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import ConfirmationDialogProvider, {
  useConfirmationDialog,
} from 'src/components/dialog/confirm-dialog';
import {
  deleteIntent,
  getDataset,
  getUnansweredDataset,
  refreshModel,
} from 'src/services/dataset-service';
import DatasetModalCreate from '../dataset-modal-create';
import DatasetModalCreateIntent from '../dataset-modal-create-intent';
import DatasetTableHead from '../dataset-table-head';
import DatasetTableRow from '../dataset-table-row';
import TableEmptyRows from '../table-empty-rows';
import TableNoData from '../table-no-data';
import { applyFilter, debounce, emptyRows, getComparator } from '../utils';

// ----------------------------------------------------------------------

export default function UnansweredPage() {
  const [groupedDataset, setGroupedDataset] = useState({});
  const [dataset, setDataset] = useState([]);
  const [currentDataset, setCurrentDataset] = useState(null);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchDataset();
  }, []);

  const fetchDataset = async () => {
    const dt = await getUnansweredDataset();
    setDataset(dt);
    const groupedDataset = groupDataset(dt);
    setGroupedDataset(groupedDataset);
  };

  const groupDataset = (dataset) => {
    // group data set by intent
    const groupedDataset = dataset.reduce((acc, item) => {
      if (!acc[item.intent]) {
        acc[item.intent] = [];
      }
      acc[item.intent].push(item);
      return acc;
    }, {});

    return groupedDataset;
  };

  const handleSearch = (text) => {
    debounce(() => {
      handleFilter(text);
    }, 500)();
  };

  const handleFilter = (text) => {
    const filteredDataset = JSON.parse(JSON.stringify(dataset)).filter(
      (item) =>
        item.intent.toLowerCase().includes(text.toLowerCase()) ||
        item.answer.toLowerCase().includes(text.toLowerCase()) ||
        item.utterance.toLowerCase().includes(text.toLowerCase())
    );
    const groupedDataset = groupDataset(filteredDataset);
    setGroupedDataset(groupedDataset);
  };

  const handleRefreshModel = async () => {
    try {
      setRefreshing(true);
      await refreshModel();
    } catch (error) {
      console.error(error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleOpenCreateModal = () => {
    setCurrentDataset(null);
    setOpenCreateModal(true);
  };

  const handleAddIntent = (data) => {
    if (!groupedDataset[data.intent]) {
      setGroupedDataset({
        ...groupedDataset,
        [data.intent]: [],
      });
    }
  };

  const handleEditIntent = (intent) => {
    setCurrentDataset({ intent });
    setOpenCreateModal(true);
  };

  return (
    <Container>
      <TextField
        sx={{
          marginBottom: 2,
        }}
        id="outlined-select-currency"
        fullWidth
        onChange={(e) => handleSearch(e.target.value)}
        size="small"
        placeholder="Search unanswered dataset..."
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
            </InputAdornment>
          ),
        }}
      />

      <Grid container spacing={3}>
        <Grid item xs={12}>
          {dataset.length === 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'flex-center', mb: 2 }}>
              <Typography
                align="center"
                variant="body2"
                sx={{ color: 'text.secondary', width: '100%', marginY: 2 }}
                onClick={handleRefreshModel}
                style={{ cursor: 'pointer' }}
              >
                No Dataset
              </Typography>
            </Box>
          )}
        </Grid>

        {Object.keys(groupedDataset).map((key) => (
          <Grid item xs={12} key={key}>
            <DatasetTable
              intent={key}
              dataset={groupedDataset[key]}
              fetchDataset={fetchDataset}
              handleEditIntent={handleEditIntent}
            />
          </Grid>
        ))}
      </Grid>

      <DatasetModalCreateIntent
        openCreateModal={openCreateModal}
        setOpenCreateModal={setOpenCreateModal}
        refresh={fetchDataset}
        data={currentDataset}
        handleAddIntent={handleAddIntent}
      />
    </Container>
  );
}

function DatasetTable(props) {
  const { dataset, fetchDataset, intent } = props;

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [openCreateModal, setOpenCreateModal] = useState(false);

  const [currentDataset, setCurrentDataset] = useState({});

  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  const { showConfirmation } = useConfirmationDialog();

  const handleSort = (event, id) => {
    const isAsc = orderBy === id && order === 'asc';
    if (id !== '') {
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    }
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = dataset.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const handleEdit = (id) => {
    setOpenCreateModal(true);

    const currentDataset = dataset.find((dataset) => dataset.id === id);

    setCurrentDataset(currentDataset);
  };

  const dataFiltered = applyFilter({
    inputData: dataset,
    comparator: getComparator(order, orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;
  const handleOpenCreateModal = () => {
    setCurrentDataset({
      intent,
    });
    setOpenCreateModal(true);
  };

  const onDelete = async () => {
    if (!dataset.length) {
      return await fetchDataset();
    }

    try {
      await deleteIntent(intent);
      await fetchDataset();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteIntent = () => {
    showConfirmation({
      title: 'Delete Intent',
      text: `Are you sure you want to delete intent "${intent}"?`,
      callback: onDelete,
    });
  };

  return (
    <ConfirmationDialogProvider>
      <Card sx={{ p: 3, mb: 3 }}>
        <Card>
          <Scrollbar>
            <TableContainer sx={{ overflow: 'unset' }}>
              <Table>
                <DatasetTableHead
                  order={order}
                  orderBy={orderBy}
                  rowCount={dataset.length}
                  numSelected={selected.length}
                  onRequestSort={handleSort}
                  onSelectAllClick={handleSelectAllClick}
                  headLabel={[
                    // { id: 'id', label: 'id' },
                    { id: 'utterance', label: 'Unanswered Question' },
                    // { id: 'answer', label: 'Answer' },
                    // { id: 'updatedAt', label: 'Updated At' },
                    { id: '' },
                  ]}
                />
                <TableBody>
                  {dataFiltered
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <DatasetTableRow
                        {...row}
                        selected={selected.indexOf(row.name) !== -1}
                        handleClick={(event) => handleClick(event, row.name)}
                        refresh={fetchDataset}
                        handleEdit={handleEdit}
                      />
                    ))}

                  <TableEmptyRows
                    height={77}
                    emptyRows={emptyRows(page, rowsPerPage, dataset.length)}
                  />

                  {notFound && <TableNoData query={filterName} />}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            page={page}
            component="div"
            count={dataset.length}
            rowsPerPage={rowsPerPage}
            onPageChange={handleChangePage}
            rowsPerPageOptions={[5, 10, 25]}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Card>

      <DatasetModalCreate
        openCreateModal={openCreateModal}
        setOpenCreateModal={setOpenCreateModal}
        refresh={fetchDataset}
        data={currentDataset}
      />
    </ConfirmationDialogProvider>
  );
}
