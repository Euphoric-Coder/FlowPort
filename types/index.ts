export type OrderStatus =
  | 'Created'
  | 'Confirmed'
  | 'Processing'
  | 'Packed'
  | 'Dispatched'
  | 'Delivered'
  | 'Cancelled';

export type ShipmentStatus =
  | 'Pending'
  | 'In Warehouse'
  | 'Dispatched'
  | 'In Transit'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Delayed'
  | 'Exception';

export type WarehouseStatus = 'Operational' | 'High Load' | 'Maintenance';

export type InventoryStatus = 'In Stock' | 'Low Stock' | 'Critical' | 'Out of Stock';

export type VehicleStatus = 'Available' | 'In Transit' | 'On Route' | 'Maintenance' | 'Charging';

export type VehicleType = 'Van' | 'Box Truck' | 'Semi-Trailer' | 'Cargo Bike' | 'Refrigerated Truck';

export type FuelKind = 'Diesel' | 'Gasoline' | 'Electric' | 'Hybrid';

export type RoutePreference = 'Shortest Distance' | 'Fastest Delivery' | 'Balanced' | 'Fuel Efficient';

export type DeliveryPriority = 'Standard' | 'Express' | 'Same-Day' | 'Economy';

export type NotificationCategory =
  | 'Delivery Alert'
  | 'Warehouse Warning'
  | 'Inventory Alert'
  | 'Fleet Update'
  | 'AI Recommendation';

export type NotificationSeverity = 'info' | 'success' | 'warning' | 'danger';

export type InsightSeverity = 'Low' | 'Medium' | 'High' | 'Critical';

export type InsightCategory =
  | 'Demand Forecast'
  | 'Route Intelligence'
  | 'Inventory Risk'
  | 'Operational Anomaly';

export interface Customer {
  id: string;
  name: string;
  company: string;
  email: string;
  city: string;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  unitValue: number;
  weightKg: number;
}

export interface Warehouse {
  id: string;
  name: string;
  region: string;
  city: string;
  manager: string;
  capacityPallets: number;
  usedPallets: number;
  incoming: number;
  outgoing: number;
  pendingFulfillment: number;
  status: WarehouseStatus;
  utilization: number;
  onTimeRate: number;
}

export interface InventoryItem {
  id: string;
  sku: string;
  productName: string;
  category: string;
  warehouseId: string;
  warehouseName: string;
  currentStock: number;
  reservedStock: number;
  availableStock: number;
  reorderThreshold: number;
  status: InventoryStatus;
  unitValue: number;
}

export interface OrderItem {
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerCompany: string;
  destinationCity: string;
  items: OrderItem[];
  itemCount: number;
  value: number;
  status: OrderStatus;
  priority: DeliveryPriority;
  warehouseId: string;
  createdAt: string;
  promisedDate: string;
  shipmentId?: string;
}

export interface ShipmentEvent {
  label: string;
  description: string;
  timestamp: string;
  completed: boolean;
  location: string;
}

export interface Shipment {
  id: string;
  trackingId: string;
  orderId: string;
  orderNumber: string;
  customerName: string;
  origin: string;
  destination: string;
  carrier: string;
  vehicleId: string;
  vehicleName: string;
  driver: string;
  status: ShipmentStatus;
  progress: number;
  distanceKm: number;
  estimatedArrival: string;
  dispatchedAt: string;
  weightKg: number;
  events: ShipmentEvent[];
}

export interface Vehicle {
  id: string;
  name: string;
  type: VehicleType;
  driver: string;
  routeId: string;
  routeName: string;
  location: string;
  fuelKind: FuelKind;
  fuelLevel: number;
  capacityKg: number;
  loadKg: number;
  status: VehicleStatus;
  odometerKm: number;
  lastServiceDate: string;
}

export interface RouteStop {
  name: string;
  x: number;
  y: number;
}

export interface RouteOption {
  id: string;
  label: string;
  distanceKm: number;
  durationMin: number;
  stops: number;
  cost: number;
  efficiency: number;
  traffic: 'Light' | 'Moderate' | 'Heavy';
  recommended: boolean;
  path: string;
  via: string[];
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  category: NotificationCategory;
  severity: NotificationSeverity;
  timestamp: string;
  read: boolean;
}

export interface Insight {
  id: string;
  title: string;
  explanation: string;
  recommendation: string;
  severity: InsightSeverity;
  category: InsightCategory;
  confidence: number;
  timestamp: string;
}

export interface ActivityEvent {
  id: string;
  kind: 'order' | 'shipment' | 'delivery' | 'warehouse' | 'fleet';
  title: string;
  detail: string;
  timestamp: string;
}
