/** Maps seed product ids to realistic display labels (SKU + name). */
const CATALOG: Record<string, { name: string; sku: string }> = {
  prod_airpods: { name: 'AirPods Pro (2nd gen)', sku: 'SKU-APL-AIR-02' },
  prod_macbook: { name: 'MacBook Pro 14"', sku: 'SKU-APL-MBP-14' },
  prod_iphone: { name: 'iPhone 15 Pro', sku: 'SKU-APL-IPH-15P' },
  prod_ipad: { name: 'iPad Air 11"', sku: 'SKU-APL-IPD-A11' },
  prod_watch: { name: 'Apple Watch Ultra 2', sku: 'SKU-APL-WCH-U2' },
  prod_sneakers: { name: 'Urban Runner Sneakers', sku: 'SKU-FSH-SNK-01' },
  prod_jacket: { name: 'Wool Blend Field Jacket', sku: 'SKU-FSH-JKT-04' },
  prod_jeans: { name: 'Slim Taper Denim', sku: 'SKU-FSH-JNS-02' },
  prod_tshirt: { name: 'Organic Cotton Tee', sku: 'SKU-FSH-TSH-09' },
  prod_bag: { name: 'Leather Crossbody Bag', sku: 'SKU-FSH-BAG-03' },
};

export function productDisplay(id: string): { name: string; sku: string } {
  return CATALOG[id] ?? {
    name: id.replace(/^prod_/, '').replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
    sku: id.replace(/^prod_/, 'SKU-').toUpperCase().slice(0, 14),
  };
}
