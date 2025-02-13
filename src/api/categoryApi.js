import axiosInstance from './axiosInstance';

// 최상위 카테고리 리스트
// http://localhost:8080/api/admin/product/category/parent
// [
//     {
//         "categoryId": 1,
//         "name": "패션/주얼리"
//     },
//     {
//         "categoryId": 3,
//         "name": "케이스/문구"
//     },
//     {
//         "categoryId": 4,
//         "name": "반려동물"
//     }
// ]
export const getParentList = async () => {
  const response = await axiosInstance.get('/product/category/parent/list');
  return response.data;
};

// 해당 카테고리의 자식 카테고리들만의 리스트
// http://localhost:8080/api/admin/product/category/8/child
// [
//     {
//         "id": 5,
//         "name": "사료/간식",
//         "logo": null
//     },
//     {
//         "id": 8,
//         "name": "반려패션",
//         "logo": null
//     },
//     {
//         "id": 11,
//         "name": "반려용품",
//         "logo": null
//     }
// ]
export const getChildList = async (parentId) => {
  const response = await axiosInstance.get(
    `/product/category/${parentId}/child/list`,
  );
  return response.data;
};
