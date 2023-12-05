import service from ".";

export const getDataset = async () => {
    try {
        const response = await service.get('/dataset');
        console.log(response);
        return response.data.data;
    } catch (error) {
        console.log(error);
        return
    }
}

/**
 * Create a new dataset.
 * 
 */
export const createDataset = async (data) => {
    try {
        const response = await service.post('/dataset', data);
        return response.data
    } catch (error) {
        console.log(error);
        return
    }
}

/**
 * Update a dataset
 */
export const updateDataset = async (id, data) => {
    try {
        const response = await service.put(`/dataset/${id}`, data);
        return response.data
    } catch (error) {
        console.log(error);
        return
    }
}

/**
 * Delete a dataset
 */
export const deleteDataset = async (id) => {
    try {
        const response = await service.delete(`/dataset/${id}`);
        return response.data
    } catch (error) {
        console.log(error);
        return
    }
}

/**
 * refresh model
 */
export const refreshModel = async () => {
    try {
        const response = await service.post('/dataset/refresh-model');
        return response.data
    } catch (error) {
        console.log(error);
        return
    }
}