import {
  BarChartOutlined,
  DashboardOutlined,
  DollarCircleOutlined,
  MessageOutlined,
  OrderedListOutlined,
  ProfileOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { Badge, Drawer, Grid, Layout } from 'antd';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import PROXY_IQ_IMAGES from 'assets/Images';
import HeaderMenu from 'components/layout/Header';
import MenuItems from 'components/layout/MenuItems';
import Sidebar from 'components/layout/Sidebar';
import { categoriesOptions } from 'features/reporting/categoriesOptionsData';
import { getUserData, isHospitalUser } from 'store/slices/loginSlice';
import {
  setOnCreateRoom,
  setOnUpdateUnreadChatCount,
} from 'store/slices/messageSlice';
import {
  roomsByHospitalIdAndUpdatedAt,
  roomsByVendorIdAndUpdatedAt,
} from 'utils/Actions';
import {
  ACCOUNT_MANAGER,
  ACCOUNT_MANAGER_USER,
  FACILITY_ACCOUNT_MANAGER,
  FACILITY_USER,
  PROVIDER_EXECUTIVE_ADMIN,
  PROVIDER_USER,
  VENDOR_ACCOUNT_MANAGER,
  VENDOR_USER,
} from 'utils/constants/global';
import './mainLayout.less';

const { Content } = Layout;

export default function MainLayout({ children }) {
  const dispatch = useDispatch();
  const userData = useSelector(getUserData);
  const isHospital = useSelector(isHospitalUser);
  const { onCreateRoom, onUpdateUnreadChatCount } = useSelector(
    (state) => state.messageReducer,
  );

  const { ProxyIQLogo } = PROXY_IQ_IMAGES.AuthIcon;
  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();
  const [open, setOpen] = useState(false);
  const [collapsed, setCollpased] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [roomData, setRoomData] = useState([]);

  const getActiveList = async () => {
    try {
      let filterParams = {
        sortDirection: 'DESC',
      };
      if (isHospital) {
        filterParams = {
          ...filterParams,
          hospitalId: userData?.accountManagerId,
        };
      } else {
        filterParams = {
          ...filterParams,
          vendorId: userData?.accountManagerId,
        };
      }
      let total = 0;
      const response = isHospital
        ? await roomsByHospitalIdAndUpdatedAt(filterParams)
        : await roomsByVendorIdAndUpdatedAt(filterParams);

      if (response.items) {
        response.items.forEach((item) => {
          const unreadMsg = isHospital
            ? item.hospitalUnreadCount
            : item.vendorUnreadCount;
          total += unreadMsg;
        });
        setRoomData(response?.items);
        setUnreadCount(total);
      }
    } catch (error) {
      console.log(
        '🚀 ~ file: MainLayout.js:224 ~ getActiveList ~ error:',
        error,
      );
    }
  };

  useEffect(() => {
    if (onCreateRoom) {
      if (
        onCreateRoom?.order?.hospitalId === userData?.accountManagerId ||
        onCreateRoom?.order?.vendorId === userData?.accountManagerId
      ) {
        const updatedRoom = [onCreateRoom, ...roomData];
        setRoomData(updatedRoom);
        dispatch(setOnCreateRoom(null));
      }
    }
  }, [onCreateRoom]);

  useEffect(() => {
    getActiveList();
  }, []);

  const showDrawer = () => {
    if (screens.xl || screens.xxl) {
      setCollpased(!collapsed);
    } else {
      setOpen(true);
    }
  };
  const onClose = () => {
    setOpen(false);
  };

  const handleClickForDrawerMenuItems = () => {
    setCollpased(true);
    onClose();
  };
  const handleClickMenuItems = () => {
    setCollpased(true);
  };

  const initialHeaderMenu = [
    {
      path: '/',
      key: '',
      icon: <DashboardOutlined />,
      roles: [
        FACILITY_ACCOUNT_MANAGER,
        FACILITY_USER,
        VENDOR_ACCOUNT_MANAGER,
        VENDOR_USER,
        ACCOUNT_MANAGER,
        ACCOUNT_MANAGER_USER,
        PROVIDER_EXECUTIVE_ADMIN,
        PROVIDER_USER,
      ],
      label: 'Home',
      hide: false,
    },
    {
      path: '/provider-orders',
      key: 'provider-orders',
      icon: <OrderedListOutlined />,
      roles: [
        FACILITY_ACCOUNT_MANAGER,
        FACILITY_USER,
        VENDOR_ACCOUNT_MANAGER,
        VENDOR_USER,
        PROVIDER_EXECUTIVE_ADMIN,
        PROVIDER_USER,
      ],
      label: 'Orders',
      hide: false,
    },
    {
      path: '/billing-orders',
      key: 'billing-orders',
      icon: <ProfileOutlined />,
      roles: [
        FACILITY_ACCOUNT_MANAGER,
        FACILITY_USER,
        VENDOR_ACCOUNT_MANAGER,
        VENDOR_USER,
      ],
      label: 'Vendor Billing',
      hide: false,
    },
    {
      path: '/contract-pricing',
      key: 'contract-pricing',
      icon: <DollarCircleOutlined />,
      roles: [
        FACILITY_ACCOUNT_MANAGER,
        FACILITY_USER,
        VENDOR_ACCOUNT_MANAGER,
        VENDOR_USER,
      ],
      label: 'Contract & Pricing',
      hide: false,
    },
    {
      path: '/chat',
      key: 'chat',
      icon: <MessageOutlined />,
      roles: [
        FACILITY_ACCOUNT_MANAGER,
        FACILITY_USER,
        VENDOR_ACCOUNT_MANAGER,
        VENDOR_USER,
      ],
      label: (
        <span>
          Chat{' '}
          <Badge
            className="unread-count-msg dot"
            count={unreadCount}
            overflowCount={99}
            status="default"
          />
        </span>
      ),
      hide: false,
    },
    {
      path: '/reporting',
      key: 'reporting',
      icon: <BarChartOutlined />,
      roles: [
        FACILITY_ACCOUNT_MANAGER,
        FACILITY_USER,
        VENDOR_ACCOUNT_MANAGER,
        VENDOR_USER,
        ACCOUNT_MANAGER,
        ACCOUNT_MANAGER_USER,
        PROVIDER_EXECUTIVE_ADMIN,
        PROVIDER_USER,
      ],
      label: 'Reporting',
      hide: false,
      children: categoriesOptions.map((item) => ({
        path: item?.path,
        key: item?.path,
        roles: item?.role,
        label: item?.title,
      })),
    },
    {
      path: '/setting',
      key: 'setting',
      icon: <SettingOutlined />,
      roles: [ACCOUNT_MANAGER, ACCOUNT_MANAGER_USER],
      label: 'Settings',
      hide: false,
    },
  ].filter((el) => !el.hide);

  useEffect(() => {
    if (onUpdateUnreadChatCount) {
      const updatedRooms =
        roomData &&
        roomData.map((item) => {
          if (item.id === onUpdateUnreadChatCount?.id) {
            return {
              ...item,
              vendorUnreadCount: onUpdateUnreadChatCount?.vendorUnreadCount,
              hospitalUnreadCount: onUpdateUnreadChatCount?.hospitalUnreadCount,
            };
          }
          return item;
        });
      setRoomData(updatedRooms);
      let total = 0;
      if (updatedRooms) {
        updatedRooms.forEach((item) => {
          const unreadMsg = isHospital
            ? item.hospitalUnreadCount
            : item.vendorUnreadCount;
          total += unreadMsg;
        });
      }
      setUnreadCount(total);
      dispatch(setOnUpdateUnreadChatCount(null));
    }
  }, [onUpdateUnreadChatCount]);

  const filterMenuItems = (menuItems, userRole) =>
    menuItems
      .filter((menuItem) => menuItem.roles.includes(userRole))
      .map((menuItem) =>
        menuItem.children
          ? {
              ...menuItem,
              children: filterMenuItems(menuItem.children, userRole),
            }
          : menuItem,
      )
      .filter((menuItem) => !menuItem.children || menuItem.children.length > 0);

  const allowedMenuItems = filterMenuItems(initialHeaderMenu, userData?.role);

  return (
    <Layout className="layout">
      <Sidebar
        collapsed={collapsed}
        handleClickItem={handleClickMenuItems}
        initialHeaderMenu={allowedMenuItems}
        setCollpased={setCollpased}
      />
      <Drawer
        className="layout sidebar-drawer"
        onClose={onClose}
        open={open}
        placement="left"
        title={<img alt="" className="logo" src={ProxyIQLogo} />}
      >
        <div className="sidebar">
          <MenuItems
            collapsed
            handleClickItem={handleClickForDrawerMenuItems}
            initialHeaderMenu={allowedMenuItems}
          />
          {/* <FooterMenu collapsed={collapsed} /> */}
        </div>
      </Drawer>
      <Layout>
        <HeaderMenu collapsed={collapsed} showDrawer={showDrawer} />
        <Content className="main" id="main">
          {children}
        </Content>
        {/* <MiniChat /> */}
      </Layout>
    </Layout>
  );
}
