import {
  sellerGroups as initialSellerGroups,
  sellerDetails as initialSellerDetails,
  buyerGroups as initialBuyerGroups,
  buyerDetails as initialBuyerDetails,
  joinGroups as initialJoinGroups,
  joinDetails as initialJoinDetails,
  drivers as initialDrivers,
  driverDetails as initialDriverDetails
} from '../data/mockData';

// 초기화 - 최초 1회만 실행
export function initializeStorage() {
  try {
    if (!localStorage.getItem('sellerGroups')) {
      localStorage.setItem('sellerGroups', JSON.stringify(initialSellerGroups));
    }
    if (!localStorage.getItem('sellerDetails')) {
      localStorage.setItem('sellerDetails', JSON.stringify(initialSellerDetails));
    }
    if (!localStorage.getItem('buyerGroups')) {
      localStorage.setItem('buyerGroups', JSON.stringify(initialBuyerGroups));
    }
    if (!localStorage.getItem('buyerDetails')) {
      localStorage.setItem('buyerDetails', JSON.stringify(initialBuyerDetails));
    }
    if (!localStorage.getItem('joinGroups')) {
      localStorage.setItem('joinGroups', JSON.stringify(initialJoinGroups));
    }
    if (!localStorage.getItem('joinDetails')) {
      localStorage.setItem('joinDetails', JSON.stringify(initialJoinDetails));
    }
    if (!localStorage.getItem('driverGroups')) {
      localStorage.setItem('driverGroups', JSON.stringify(initialDrivers));
    }
    if (!localStorage.getItem('driverDetails')) {
      localStorage.setItem('driverDetails', JSON.stringify(initialDriverDetails));
    }
  } catch (error) {
    console.error('Storage initialization failed:', error);
  }
}

// 읽기
export function getStoredGroups(type) {
  try {
    const key = `${type}Groups`;
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error(`Failed to get ${type} groups:`, error);
    return [];
  }
}

export function getStoredDetails(type, id) {
  try {
    const key = `${type}Details`;
    const stored = localStorage.getItem(key);
    const details = stored ? JSON.parse(stored) : {};
    return details[id] || null;
  } catch (error) {
    console.error(`Failed to get ${type} details for id ${id}:`, error);
    return null;
  }
}

export function getAllStoredDetails(type) {
  try {
    const key = `${type}Details`;
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error(`Failed to get all ${type} details:`, error);
    return {};
  }
}

// 쓰기
export function updateGroup(type, groupId, updates) {
  try {
    const key = `${type}Groups`;
    const groups = getStoredGroups(type);
    const updatedGroups = groups.map(g =>
      g.id === groupId ? { ...g, ...updates } : g
    );
    localStorage.setItem(key, JSON.stringify(updatedGroups));
    return updatedGroups;
  } catch (error) {
    console.error(`Failed to update ${type} group:`, error);
    throw error;
  }
}

export function updateDetails(type, groupId, updates) {
  try {
    const key = `${type}Details`;
    const allDetails = getAllStoredDetails(type);
    allDetails[groupId] = { ...allDetails[groupId], ...updates };
    localStorage.setItem(key, JSON.stringify(allDetails));
    return allDetails[groupId];
  } catch (error) {
    console.error(`Failed to update ${type} details:`, error);
    throw error;
  }
}

// 사업자 추가
export function addBusinessToGroup(type, groupId, businessData) {
  try {
    const key = `${type}Details`;
    const allDetails = getAllStoredDetails(type);

    if (!allDetails[groupId]) {
      allDetails[groupId] = { businesses: [] };
    }

    if (!allDetails[groupId].businesses) {
      allDetails[groupId].businesses = [];
    }

    allDetails[groupId].businesses.push(businessData);
    localStorage.setItem(key, JSON.stringify(allDetails));

    // 그룹 businessCount도 업데이트
    const groups = getStoredGroups(type);
    const updatedGroups = groups.map(g =>
      g.id === groupId ? { ...g, businessCount: allDetails[groupId].businesses.length } : g
    );
    localStorage.setItem(`${type}Groups`, JSON.stringify(updatedGroups));

    return allDetails[groupId];
  } catch (error) {
    console.error(`Failed to add business to ${type} group:`, error);
    throw error;
  }
}

// 사업자 업데이트
export function updateBusiness(type, groupId, businessIndex, updates) {
  try {
    const key = `${type}Details`;
    const allDetails = getAllStoredDetails(type);

    if (allDetails[groupId]?.businesses?.[businessIndex]) {
      allDetails[groupId].businesses[businessIndex] = {
        ...allDetails[groupId].businesses[businessIndex],
        ...updates
      };
      localStorage.setItem(key, JSON.stringify(allDetails));
    }

    return allDetails[groupId];
  } catch (error) {
    console.error(`Failed to update ${type} business:`, error);
    throw error;
  }
}

// 신규 그룹 추가
export function addNewGroup(type, groupData, businessesData) {
  try {
    // 새 ID 생성
    const groups = getStoredGroups(type);
    const newId = groups.length > 0 ? Math.max(...groups.map(g => g.id)) + 1 : 1;

    // 그룹 추가
    const newGroup = {
      id: newId,
      ...groupData,
      businessCount: businessesData.length,
      status: 'active'
    };
    groups.push(newGroup);
    localStorage.setItem(`${type}Groups`, JSON.stringify(groups));

    // 상세 정보 추가
    const allDetails = getAllStoredDetails(type);
    allDetails[newId] = {
      businesses: businessesData,
      ...groupData
    };
    localStorage.setItem(`${type}Details`, JSON.stringify(allDetails));

    return { id: newId, group: newGroup, details: allDetails[newId] };
  } catch (error) {
    console.error(`Failed to add new ${type} group:`, error);
    throw error;
  }
}
