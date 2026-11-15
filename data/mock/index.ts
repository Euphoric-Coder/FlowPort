import type {
  ActivityEvent,
  AppNotification,
  Customer,
  Insight,
  InventoryItem,
  Order,
  Product,
  Shipment,
  Vehicle,
  Warehouse,
} from '@/types';

// Deterministic PRNG so every page load shows the same data.
let seed = 42;
function rand(): number {
  seed = (seed * 1664525 + 1013904223) % 4294967296;
  return seed / 4294967296;
}
function pick<T>(arr: T[]): T {
  return arr[Math.floor(rand() * arr.length)];
}
function randInt(min: number, max: number): number {
  return Math.floor(rand() * (max - min + 1)) + min;
}

const CENTERS = [
  { city: 'New York', region: 'Northeast' },
  { city: 'Chicago', region: 'Midwest' },
  { city: 'Dallas', region: 'South Central' },
  { city: 'Atlanta', region: 'Southeast' },
  { city: 'Denver', region: 'Mountain' },
  { city: 'Seattle', region: 'Pacific Northwest' },
  { city: 'Los Angeles', region: 'Pacific' },
  { city: 'Miami', region: 'South Florida' },
];

const CITIES = [
  'Boston', 'Philadelphia', 'Pittsburgh', 'Detroit', 'Minneapolis', 'Kansas City',
  'Houston', 'Austin', 'Nashville', 'Charlotte', 'Salt Lake City', 'Portland',
  'San Francisco', 'Phoenix', 'Memphis', 'Columbus', 'Indianapolis', 'Baltimore',
];

export const customers: Customer[] = [
  { id: 'CUS-1001', name: 'Amelia Hart', company: 'Northwind Retail', email: 'amelia@northwind.io', city: 'Boston' },
  { id: 'CUS-1002', name: 'Daniel Okafor', company: 'Vertex Electronics', email: 'd.okafor@vertexel.com', city: 'Austin' },
  { id: 'CUS-1003', name: 'Sofia Marino', company: 'Marino Home Goods', email: 'sofia@marinohome.com', city: 'Chicago' },
  { id: 'CUS-1004', name: 'Liam Chen', company: 'Cascade Outdoors', email: 'liam@cascadeco.com', city: 'Seattle' },
  { id: 'CUS-1005', name: 'Grace Sullivan', company: 'Sullivan Pharmacy', email: 'grace@sullivanrx.com', city: 'Philadelphia' },
  { id: 'CUS-1006', name: 'Noah Weber', company: 'Weber Industrial', email: 'noah@weberind.com', city: 'Detroit' },
  { id: 'CUS-1007', name: 'Maya Patel', company: 'FreshCart Grocers', email: 'maya@freshcart.co', city: 'Phoenix' },
  { id: 'CUS-1008', name: 'Ethan Brooks', company: 'Brooks Auto Parts', email: 'ethan@brooksap.com', city: 'Nashville' },
];

export const products: Product[] = [
  { id: 'PRD-2001', sku: 'SKU-4821', name: 'Wireless Sensor Hub', category: 'Electronics', unitValue: 89, weightKg: 1.2 },
  { id: 'PRD-2002', sku: 'SKU-1194', name: 'LED Panel Light 2ft', category: 'Lighting', unitValue: 42, weightKg: 2.4 },
  { id: 'PRD-2003', sku: 'SKU-7315', name: 'Thermal Jacket XL', category: 'Apparel', unitValue: 128, weightKg: 0.9 },
  { id: 'PRD-2004', sku: 'SKU-3388', name: 'Ceramic Tile Pack', category: 'Building', unitValue: 36, weightKg: 18.5 },
  { id: 'PRD-2005', sku: 'SKU-9072', name: 'Cold Pack Meds 12ct', category: 'Pharma', unitValue: 210, weightKg: 0.6 },
  { id: 'PRD-2006', sku: 'SKU-5561', name: 'Cordless Drill Kit', category: 'Tools', unitValue: 175, weightKg: 3.1 },
  { id: 'PRD-2007', sku: 'SKU-2243', name: 'Organic Coffee 5lb', category: 'Grocery', unitValue: 64, weightKg: 2.3 },
  { id: 'PRD-2008', sku: 'SKU-6634', name: 'Brake Rotor Set', category: 'Auto Parts', unitValue: 132, weightKg: 9.8 },
  { id: 'PRD-2009', sku: 'SKU-8810', name: 'Yoga Mat Premium', category: 'Fitness', unitValue: 58, weightKg: 1.4 },
  { id: 'PRD-2010', sku: 'SKU-4402', name: 'Smart Thermostat', category: 'Electronics', unitValue: 199, weightKg: 0.8 },
];

function warehouseUtilization(status: Warehouse['status']): number {
  if (status === 'Maintenance') return randInt(18, 34);
  if (status === 'High Load') return randInt(88, 96);
  return randInt(58, 82);
}

export const warehouses: Warehouse[] = CENTERS.map((c, i) => {
  const n = String(i + 1).padStart(3, '0');
  const capacity = randInt(18, 42) * 100;
  const status: Warehouse['status'] = i === 2 ? 'Maintenance' : i === 1 ? 'High Load' : 'Operational';
  const used = Math.round((capacity * warehouseUtilization(status)) / 100);
  return {
    id: `WH-${n}`,
    name: `${c.city} Distribution Center`,
    region: c.region,
    city: c.city,
    manager: pick(['Jordan Reyes', 'Priya Nair', 'Tomás Alvarez', 'Hana Kim', 'Marcus Webb', 'Elena Petrov']),
    capacityPallets: capacity,
    usedPallets: used,
    incoming: randInt(8, 42),
    outgoing: randInt(12, 55),
    pendingFulfillment: randInt(5, 38),
    status,
    utilization: Math.round((used / capacity) * 1000) / 10,
    onTimeRate: randInt(94, 100) + rand() / 10,
  };
});

export const inventory: InventoryItem[] = Array.from({ length: 24 }, (_, i) => {
  const product = products[i % products.length];
  const wh = warehouses[i % warehouses.length];
  const current = randInt(0, 860);
  const reserved = Math.min(current, randInt(0, 180));
  const threshold = randInt(80, 200);
  const available = current - reserved;
  const status: InventoryItem['status'] =
    current === 0 ? 'Out of Stock'
    : current <= threshold * 0.5 ? 'Critical'
    : current <= threshold ? 'Low Stock'
    : 'In Stock';
  return {
    id: `INV-${String(i + 1).padStart(3, '0')}`,
    sku: product.sku,
    productName: product.name,
    category: product.category,
    warehouseId: wh.id,
    warehouseName: wh.name,
    currentStock: current,
    reservedStock: reserved,
    availableStock: available,
    reorderThreshold: threshold,
    status,
    unitValue: product.unitValue,
  };
});

export const vehicles: Vehicle[] = [
  { id: 'VEH-01', name: 'FP-1001', type: 'Semi-Trailer', driver: 'Marcus Reed', routeId: 'RT-004', routeName: 'Chicago → St. Louis', location: 'I-55 near Bloomington', fuelKind: 'Diesel', fuelLevel: 78, capacityKg: 20000, loadKg: 16200, status: 'In Transit', odometerKm: 184320, lastServiceDate: '2026-10-02' },
  { id: 'VEH-02', name: 'FP-1002', type: 'Van', driver: 'Lena Ortiz', routeId: 'RT-011', routeName: 'Dallas Metro Loop', location: 'Dallas, TX', fuelKind: 'Gasoline', fuelLevel: 64, capacityKg: 1500, loadKg: 980, status: 'On Route', odometerKm: 62110, lastServiceDate: '2026-09-18' },
  { id: 'VEH-03', name: 'FP-1003', type: 'Refrigerated Truck', driver: 'Ade Bello', routeId: 'RT-018', routeName: 'Atlanta → Jacksonville', location: 'I-75 near Tifton', fuelKind: 'Diesel', fuelLevel: 41, capacityKg: 12000, loadKg: 9600, status: 'In Transit', odometerKm: 142890, lastServiceDate: '2026-08-30' },
  { id: 'VEH-04', name: 'FP-1004', type: 'Box Truck', driver: 'Sara Lindqvist', routeId: 'RT-007', routeName: 'Denver Local AM', location: 'Denver, CO', fuelKind: 'Electric', fuelLevel: 86, capacityKg: 4500, loadKg: 3100, status: 'Available', odometerKm: 28410, lastServiceDate: '2026-10-11' },
  { id: 'VEH-05', name: 'FP-1005', type: 'Semi-Trailer', driver: 'James Wu', routeId: 'RT-022', routeName: 'Seattle → Portland', location: 'I-5 near Olympia', fuelKind: 'Diesel', fuelLevel: 57, capacityKg: 20000, loadKg: 18400, status: 'In Transit', odometerKm: 210050, lastServiceDate: '2026-07-21' },
  { id: 'VEH-06', name: 'FP-1006', type: 'Cargo Bike', driver: 'Noor Haddad', routeId: 'RT-025', routeName: 'NYC Last-Mile 12', location: 'Brooklyn, NY', fuelKind: 'Electric', fuelLevel: 72, capacityKg: 120, loadKg: 64, status: 'On Route', odometerKm: 3120, lastServiceDate: '2026-10-20' },
  { id: 'VEH-07', name: 'FP-1007', type: 'Box Truck', driver: 'Victor Osei', routeId: '—', routeName: 'Unassigned', location: 'Miami Depot', fuelKind: 'Gasoline', fuelLevel: 22, capacityKg: 4500, loadKg: 0, status: 'Maintenance', odometerKm: 98470, lastServiceDate: '2026-06-14' },
  { id: 'VEH-08', name: 'FP-1008', type: 'Van', driver: 'Ivy Nakamura', routeId: 'RT-013', routeName: 'LA Metro South', location: 'Los Angeles, CA', fuelKind: 'Electric', fuelLevel: 93, capacityKg: 1500, loadKg: 1120, status: 'Charging', odometerKm: 41230, lastServiceDate: '2026-09-29' },
  { id: 'VEH-09', name: 'FP-1009', type: 'Refrigerated Truck', driver: 'Rafael Duarte', routeId: 'RT-009', routeName: 'Chicago → Milwaukee', location: 'Chicago, IL', fuelKind: 'Diesel', fuelLevel: 69, capacityKg: 12000, loadKg: 8900, status: 'Available', odometerKm: 121400, lastServiceDate: '2026-10-05' },
  { id: 'VEH-10', name: 'FP-1010', type: 'Semi-Trailer', driver: 'Hannah Berg', routeId: 'RT-018', routeName: 'Atlanta → Jacksonville', location: 'Atlanta, GA', fuelKind: 'Hybrid', fuelLevel: 55, capacityKg: 20000, loadKg: 14200, status: 'Available', odometerKm: 76300, lastServiceDate: '2026-10-15' },
];

export const orders: Order[] = Array.from({ length: 22 }, (_, i) => {
  const customer = customers[i % customers.length];
  const wh = warehouses[(i * 3) % warehouses.length];
  const itemCount = randInt(1, 4);
  const items: Order['items'] = Array.from({ length: itemCount }, (_, j) => {
    const p = products[(i + j) % products.length];
    const qty = randInt(2, 40);
    return { productId: p.id, productName: p.name, sku: p.sku, quantity: qty, unitPrice: p.unitValue };
  });
  const value = items.reduce((s, it) => s + it.quantity * it.unitPrice, 0);
  const status = pick<Order['status']>([
    'Processing', 'Confirmed', 'Packed', 'Dispatched', 'Delivered', 'Delivered', 'Delivered', 'Created', 'Cancelled',
  ]);
  return {
    id: `ORD-${String(i + 1).padStart(3, '0')}`,
    orderNumber: `#${241100 + i}`,
    customerId: customer.id,
    customerName: customer.name,
    customerCompany: customer.company,
    destinationCity: customer.city,
    items,
    itemCount: items.reduce((s, it) => s + it.quantity, 0),
    value,
    status,
    priority: pick(['Standard', 'Express', 'Same-Day', 'Economy']),
    warehouseId: wh.id,
    createdAt: `2026-11-${String(randInt(1, 11)).padStart(2, '0')} 09:30`,
    promisedDate: `2026-11-${String(randInt(12, 20)).padStart(2, '0')}`,
  };
});

function makeEvents(status: Shipment['status'], origin: string, dest: string): Shipment['events'] {
  const steps: Array<[string, string]> = [
    ['Order Received', 'Shipment created and awaiting processing'],
    ['In Warehouse', 'Goods received and palletized'],
    ['Dispatched', 'Assigned to carrier and loaded'],
    ['In Transit', 'Departed origin facility'],
    ['Out for Delivery', 'Arrived at local delivery hub'],
    ['Delivered', 'Signed for at destination'],
  ];
  const cutoff: Record<string, number> = {
    'Pending': 0, 'In Warehouse': 1, 'Dispatched': 2, 'In Transit': 3,
    'Out for Delivery': 4, 'Delivered': 6, 'Delayed': 3, 'Exception': 3,
  };
  const cut = cutoff[status] ?? 3;
  return steps.map(([label, description], i) => ({
    label,
    description,
    timestamp: `2026-11-${String(9 + (i % 3)).padStart(2, '0')} ${String(8 + i).padStart(2, '0')}:${i % 2 ? '40' : '15'}`,
    completed: i < cut,
    location: i < 3 ? origin : dest,
  }));
}

export const shipments: Shipment[] = Array.from({ length: 18 }, (_, i) => {
  const order = orders[i % orders.length];
  const wh = warehouses[i % warehouses.length];
  const vehicle = vehicles[i % vehicles.length];
  const dest = pick(CITIES);
  const status = pick<Shipment['status']>([
    'In Transit', 'In Transit', 'Out for Delivery', 'Delivered', 'Delivered',
    'Dispatched', 'In Warehouse', 'Delayed', 'Pending', 'Exception',
  ]);
  const progress = status === 'Delivered' ? 100 : status === 'Pending' ? 0 : randInt(15, 92);
  return {
    id: `SHP-${String(i + 1).padStart(3, '0')}`,
    trackingId: `FPX-${100000 + i * 7717}`,
    orderId: order.id,
    orderNumber: order.orderNumber,
    customerName: order.customerName,
    origin: `${wh.city}, ${wh.region}`,
    destination: `${dest}, US`,
    carrier: pick(['FlowPort Direct', 'Meridian Freight', 'BlueLane Logistics']),
    vehicleId: vehicle.id,
    vehicleName: vehicle.name,
    driver: vehicle.driver,
    status,
    progress,
    distanceKm: randInt(90, 2400),
    estimatedArrival: `2026-11-1${randInt(1, 9)} ${randInt(9, 18)}:${rand() > 0.5 ? '30' : '00'}`,
    dispatchedAt: '2026-11-09 08:15',
    weightKg: randInt(40, 9500),
    events: makeEvents(status, `${wh.city}, ${wh.region}`, `${dest}, US`),
  };
});

orders.forEach((order, i) => {
  order.shipmentId = shipments[i % shipments.length]?.id;
});

export const notifications: AppNotification[] = [
  { id: 'N-01', title: 'Delivery completed', message: 'SHP-004 signed for in Charlotte by J. Whitfield.', category: 'Delivery Alert', severity: 'success', timestamp: '12 min ago', read: false },
  { id: 'N-02', title: 'Warehouse capacity warning', message: 'WH-002 Chicago is at 94% capacity and may need overflow routing.', category: 'Warehouse Warning', severity: 'warning', timestamp: '48 min ago', read: false },
  { id: 'N-03', title: 'Low stock: SKU-9072', message: 'Cold Pack Meds 12ct at WH-003 is below the reorder threshold.', category: 'Inventory Alert', severity: 'warning', timestamp: '1 h ago', read: false },
  { id: 'N-04', title: 'Vehicle awaiting service', message: 'FP-1007 has not been serviced in 120 days; routed to maintenance queue.', category: 'Fleet Update', severity: 'info', timestamp: '2 h ago', read: true },
  { id: 'N-05', title: 'Simulated AI recommendation', message: 'Consider redistributing inventory from WH-002 to WH-004 ahead of forecast demand.', category: 'AI Recommendation', severity: 'info', timestamp: '3 h ago', read: false },
  { id: 'N-06', title: 'Shipment delayed', message: 'SHP-009 is running 2h 15m behind due to weather near Tifton, GA.', category: 'Delivery Alert', severity: 'danger', timestamp: '4 h ago', read: true },
  { id: 'N-07', title: 'Out for delivery', message: 'SHP-006 is out for delivery in Brooklyn on route NYC Last-Mile 12.', category: 'Delivery Alert', severity: 'info', timestamp: '5 h ago', read: true },
  { id: 'N-08', title: 'Fleet charging complete', message: 'FP-1008 finished charging and is ready for the LA Metro South route.', category: 'Fleet Update', severity: 'success', timestamp: '6 h ago', read: true },
];

export const insights: Insight[] = [
  { id: 'AI-01', title: 'Demand rising in the Eastern region', explanation: 'Projected order volume in the Eastern distribution region is expected to increase 14% over the next 10 days based on historical seasonality in the mock dataset.', recommendation: 'Pre-position fast-moving SKUs at WH-001 New York and WH-004 Atlanta.', severity: 'Medium', category: 'Demand Forecast', confidence: 86, timestamp: '18 min ago' },
  { id: 'AI-02', title: 'WH-003 approaching capacity limit', explanation: 'At the current inbound rate, Dallas DC is simulated to exceed 95% capacity within 3 days.', recommendation: 'Divert 8–10 inbound shipments to WH-005 Denver.', severity: 'High', category: 'Inventory Risk', confidence: 91, timestamp: '1 h ago' },
  { id: 'AI-03', title: 'Route cluster RT-018 has optimization potential', explanation: 'Two vehicles run overlapping Atlanta → Jacksonville corridors with 31% combined idle capacity.', recommendation: 'Consolidate into a single double-trailer run on weekdays.', severity: 'Medium', category: 'Route Intelligence', confidence: 78, timestamp: '2 h ago' },
  { id: 'AI-04', title: 'Unusual dwell time at Chicago DC', explanation: 'Average dock-to-dispatch dwell time is simulated 22% above the network baseline for this week.', recommendation: 'Review staffing for the 06:00–10:00 dock shift.', severity: 'Low', category: 'Operational Anomaly', confidence: 72, timestamp: '4 h ago' },
  { id: 'AI-05', title: 'Critical stock risk for SKU-9072', explanation: 'Pharma SKU-9072 at WH-003 has zero available stock after reservations, with 4 open orders referencing it.', recommendation: 'Trigger a replenishment transfer from WH-007 Los Angeles.', severity: 'Critical', category: 'Inventory Risk', confidence: 95, timestamp: '5 h ago' },
];

export const activityFeed: ActivityEvent[] = [
  { id: 'A-01', kind: 'delivery', title: 'Delivery completed', detail: 'SHP-004 delivered in Charlotte, 14 min ahead of estimate.', timestamp: '12 min ago' },
  { id: 'A-02', kind: 'shipment', title: 'Shipment dispatched', detail: 'SHP-011 left Denver DC on FP-1004 toward Salt Lake City.', timestamp: '26 min ago' },
  { id: 'A-03', kind: 'order', title: 'Order fulfilled', detail: 'Order #241104 packed at Atlanta DC — 46 units, ready for dispatch.', timestamp: '1 h ago' },
  { id: 'A-04', kind: 'warehouse', title: 'Warehouse alert', detail: 'Chicago DC inbound queue is 9 shipments above normal.', timestamp: '2 h ago' },
  { id: 'A-05', kind: 'fleet', title: 'Vehicle maintenance', detail: 'FP-1007 entered maintenance bay; vehicle swap assigned to RT-013.', timestamp: '3 h ago' },
  { id: 'A-06', kind: 'delivery', title: 'Out for delivery', detail: 'SHP-006 is out for delivery in Brooklyn on a cargo bike route.', timestamp: '3 h ago' },
  { id: 'A-07', kind: 'order', title: 'New order created', detail: 'Order #241121 from FreshCart Grocers — $3,182 across 3 lines.', timestamp: '4 h ago' },
];

export const kpis = {
  totalShipments: { value: 12846, change: 8.4, trend: 'up' as const },
  activeDeliveries: { value: 1284, change: 3.1, trend: 'up' as const },
  onTimeRate: { value: 98.2, change: -0.6, trend: 'down' as const, suffix: '%' },
  pendingOrders: { value: 346, change: -12.2, trend: 'down' as const },
  fleetUtilization: { value: 84.6, change: 2.8, trend: 'up' as const, suffix: '%' },
  warehouseCapacity: { value: 72.4, change: 1.9, trend: 'up' as const, suffix: '%' },
};

export const shipmentVolume = {
  '7d': [
    { label: 'Mon', shipments: 312, delivered: 289 },
    { label: 'Tue', shipments: 348, delivered: 321 },
    { label: 'Wed', shipments: 402, delivered: 366 },
    { label: 'Thu', shipments: 389, delivered: 371 },
    { label: 'Fri', shipments: 456, delivered: 428 },
    { label: 'Sat', shipments: 298, delivered: 280 },
    { label: 'Sun', shipments: 241, delivered: 228 },
  ],
  '30d': [
    { label: 'W1', shipments: 2140, delivered: 1980 },
    { label: 'W2', shipments: 2360, delivered: 2210 },
    { label: 'W3', shipments: 2290, delivered: 2145 },
    { label: 'W4', shipments: 2680, delivered: 2530 },
    { label: 'Today', shipments: 640, delivered: 590 },
  ],
};

export const deliveryPerformance = [
  { label: 'Mon', completed: 289, delayed: 14, pending: 9 },
  { label: 'Tue', completed: 321, delayed: 18, pending: 9 },
  { label: 'Wed', completed: 366, delayed: 22, pending: 14 },
  { label: 'Thu', completed: 371, delayed: 11, pending: 7 },
  { label: 'Fri', completed: 428, delayed: 19, pending: 9 },
  { label: 'Sat', completed: 280, delayed: 12, pending: 6 },
  { label: 'Sun', completed: 228, delayed: 8, pending: 5 },
];

export const statusDistribution = [
  { name: 'Delivered', value: 6420, color: 'hsl(160 84% 39%)' },
  { name: 'In Transit', value: 3210, color: 'hsl(217 91% 60%)' },
  { name: 'Processing', value: 1840, color: 'hsl(199 89% 48%)' },
  { name: 'Delayed', value: 740, color: 'hsl(38 92% 50%)' },
  { name: 'Exception', value: 636, color: 'hsl(0 84% 60%)' },
];

export const fleetUtilizationData = [
  { label: 'Long-haul', utilization: 91, vehicles: 24 },
  { label: 'Regional', utilization: 84, vehicles: 58 },
  { label: 'Metro last-mile', utilization: 76, vehicles: 132 },
  { label: 'Cold chain', utilization: 88, vehicles: 31 },
  { label: 'Cargo bikes', utilization: 62, vehicles: 75 },
];

export const regionalPerformance = [
  { region: 'Northeast', revenue: 184200, shipments: 2840, onTime: 98.6, cost: 74200 },
  { region: 'Midwest', revenue: 162800, shipments: 2510, onTime: 97.9, cost: 68400 },
  { region: 'Southeast', revenue: 148600, shipments: 2280, onTime: 98.1, cost: 61200 },
  { region: 'Pacific', revenue: 141200, shipments: 2140, onTime: 97.2, cost: 63800 },
  { region: 'Mountain', revenue: 96400, shipments: 1480, onTime: 98.8, cost: 41200 },
  { region: 'South Central', revenue: 108900, shipments: 1596, onTime: 96.8, cost: 48900 },
];

export const slaCompliance = [
  { label: 'Same-Day', target: 95, actual: 94.2 },
  { label: 'Next-Day', target: 97, actual: 98.1 },
  { label: '2-Day', target: 98, actual: 98.7 },
  { label: 'Economy', target: 99, actual: 99.2 },
];

export const demandForecast = [
  { label: 'Jun', actual: 2180, forecast: null as number | null },
  { label: 'Jul', actual: 2260, forecast: null },
  { label: 'Aug', actual: 2410, forecast: null },
  { label: 'Sep', actual: 2340, forecast: null },
  { label: 'Oct', actual: 2580, forecast: null },
  { label: 'Nov', actual: 2712, forecast: 2740 },
  { label: 'Dec', actual: null, forecast: 3050 },
  { label: 'Jan', actual: null, forecast: 2680 },
  { label: 'Feb', actual: null, forecast: 2490 },
  { label: 'Mar', actual: null, forecast: 2620 },
];

export const costBreakdown = [
  { label: 'Fuel', value: 92400 },
  { label: 'Labor', value: 128600 },
  { label: 'Maintenance', value: 41200 },
  { label: 'Warehousing', value: 86800 },
  { label: 'Carrier fees', value: 54300 },
];

export const aiAssistantResponses: Array<{ keywords: string[]; response: string; bullets: string[] }> = [
  {
    keywords: ['capacity', 'warehouse', 'approaching'],
    response: 'Based on the current mock snapshot, two facilities are near their capacity ceiling:',
    bullets: [
      'WH-002 Chicago — 94% utilized, High Load status, inbound queue above normal',
      'WH-003 Dallas — maintenance window scheduled, 31% utilized during the closure',
      'Network average utilization is 72.4% across 24 active facilities',
    ],
  },
  {
    keywords: ['delayed', 'delay', 'late', 'behind'],
    response: 'There are 740 simulated delayed shipments in the current window. The most significant:',
    bullets: [
      'SHP-009 — running 2h 15m behind due to weather near Tifton, GA',
      'RT-018 corridor (Atlanta → Jacksonville) carries 3 of the delayed shipments',
      'Rec: notify affected customers and review the Friday dispatch window',
    ],
  },
  {
    keywords: ['inventory', 'stock', 'risk', 'replenish'],
    response: 'Inventory risk scan across all warehouses (mock data):',
    bullets: [
      'SKU-9072 Cold Pack Meds — Out of Stock at WH-003 with 4 open orders',
      'SKU-3388 Ceramic Tile Pack — Critical at WH-002, below 50% of reorder threshold',
      '6 additional SKUs are flagged Low Stock across 4 facilities',
    ],
  },
  {
    keywords: ['summar', 'today', 'operations', 'overview'],
    response: 'Today\'s simulated operations summary for your workspace:',
    bullets: [
      '12,846 total shipments; 1,284 active deliveries right now',
      '98.2% on-time delivery rate (−0.6% vs. last week)',
      '346 pending orders and 84.6% fleet utilization',
      '1 critical AI insight requires review (SKU-9072 stock-out risk)',
    ],
  },
  {
    keywords: ['route', 'optimize', 'corridor'],
    response: 'Route intelligence highlights from the mock corridor analysis:',
    bullets: [
      'RT-018 — two overlapping Atlanta → Jacksonville runs, 31% idle capacity',
      'RT-011 Dallas Metro Loop — 6 stops can be re-sequenced to save ~48 min',
      'RT-004 Chicago → St. Louis — fuel-lean alternative saves 11% of fuel cost',
    ],
  },
  {
    keywords: ['fleet', 'vehicle', 'driver', 'maintenance'],
    response: 'Fleet status from the mock dataset:',
    bullets: [
      '10 vehicles tracked in the demo workspace; 4 in transit',
      'FP-1007 is in the maintenance bay with no assigned route',
      'FP-1008 is charging and ready for the LA Metro South route',
    ],
  },
];

export function getAssistantResponse(query: string): { response: string; bullets: string[] } {
  const q = query.toLowerCase();
  const match = aiAssistantResponses.find((r) => r.keywords.some((k) => q.includes(k)));
  if (match) return { response: match.response, bullets: match.bullets };
  return {
    response: 'I can answer questions grounded in the FlowPort mock dataset. Try one of these:',
    bullets: [
      'Which warehouses are approaching capacity?',
      'Show delayed shipments.',
      'Identify inventory risks.',
      "Summarize today's operations.",
    ],
  };
}
