module.exports = [
  {
    name: 'customer',
    description: 'Customer who can browse food and place orders',
    permissions: [
      'view_products',
      'manage_cart',
      'manage_addresses',
      'create_orders',
      'view_orders'
    ],
    isActive: true
  },
  {
    name: 'admin',
    description: 'Administrator with full application access',
    permissions: [
      'manage_users',
      'manage_products',
      'manage_categories',
      'manage_orders',
      'manage_roles',
      'view_reports'
    ],
    isActive: true
  },
  {
    name: 'kitchen',
    description: 'Kitchen staff responsible for food preparation',
    permissions: [
      'view_orders',
      'update_order_status',
      'view_products'
    ],
    isActive: true
  },
  {
    name: 'delivery',
    description: 'Delivery partner responsible for order delivery',
    permissions: [
      'view_assigned_orders',
      'update_delivery_status'
    ],
    isActive: true
  }
];