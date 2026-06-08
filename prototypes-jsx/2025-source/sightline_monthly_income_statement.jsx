import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

/*
 * SIGHTLINE - Monthly Income Statement with Drill-Down
 * =====================================================
 * Full drill-down: Month → Section → Account → Vendor → Invoice
 */

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Full monthly data with vendor/invoice detail for each month
const monthlyData = {
  Jan: {
    revenue: { budget: 680000, actual: 695000, accounts: [
      { code: '4100', name: 'Membership Dues', budget: 516000, actual: 528000, vendors: [
        { name: 'Annual Dues - Q1', invoices: [{ id: 'DUE-2024-001', date: 'Jan 2', amount: 528000, status: 'paid', desc: 'Q1 dues collection' }] }
      ]},
      { code: '4200', name: 'F&B Revenue', budget: 105000, actual: 112000, vendors: [
        { name: 'Restaurant Sales', invoices: [{ id: 'POS-Jan', date: 'Jan 31', amount: 78000, status: 'posted', desc: 'Monthly restaurant' }] },
        { name: 'Banquet Events', invoices: [{ id: 'BNQ-2024-008', date: 'Jan 18', amount: 34000, status: 'paid', desc: 'Miller Anniversary' }] }
      ]},
      { code: '4300', name: 'Golf Operations', budget: 42000, actual: 38000, vendors: [
        { name: 'Green Fees', invoices: [{ id: 'GF-Jan', date: 'Jan 31', amount: 28000, status: 'posted' }] },
        { name: 'Cart Rentals', invoices: [{ id: 'CART-Jan', date: 'Jan 31', amount: 10000, status: 'posted' }] }
      ]},
      { code: '4400', name: 'Other Income', budget: 17000, actual: 17000, vendors: [
        { name: 'Locker Rentals', invoices: [{ id: 'LKR-Jan', date: 'Jan 1', amount: 12000, status: 'paid' }] },
        { name: 'Guest Fees', invoices: [{ id: 'GUE-Jan', date: 'Jan 31', amount: 5000, status: 'posted' }] }
      ]}
    ]},
    expenses: { budget: 505000, actual: 492000, accounts: [
      { code: '5100', name: 'Payroll & Benefits', budget: 200000, actual: 198000, vendors: [
        { name: 'ADP Payroll Services', invoices: [
          { id: 'ADP-2024-01', date: 'Jan 5', amount: 99000, status: 'paid', desc: 'Bi-weekly payroll' },
          { id: 'ADP-2024-02', date: 'Jan 19', amount: 99000, status: 'paid', desc: 'Bi-weekly payroll' }
        ]},
      ]},
      { code: '5200', name: 'Food & Beverage Cost', budget: 145000, actual: 142000, vendors: [
        { name: 'Sysco Foods', invoices: [
          { id: 'SYS-820145', date: 'Jan 8', amount: 32000, status: 'paid', desc: 'Weekly food order' },
          { id: 'SYS-820289', date: 'Jan 15', amount: 31000, status: 'paid', desc: 'Weekly food order' },
          { id: 'SYS-820456', date: 'Jan 22', amount: 29000, status: 'paid', desc: 'Weekly food order' },
          { id: 'SYS-820612', date: 'Jan 29', amount: 30000, status: 'paid', desc: 'Weekly food order' }
        ]},
        { name: 'Southern Wine & Spirits', invoices: [{ id: 'SWS-11892', date: 'Jan 10', amount: 20000, status: 'paid', desc: 'Beverage restock' }] }
      ]},
      { code: '5300', name: 'Golf Course Maintenance', budget: 75000, actual: 72000, vendors: [
        { name: 'SiteOne Landscape Supply', invoices: [{ id: 'S1-445123', date: 'Jan 12', amount: 18000, status: 'paid', desc: 'Fertilizer & chemicals' }] },
        { name: 'Toro Equipment Co.', invoices: [{ id: 'TORO-2024-012', date: 'Jan 20', amount: 28000, status: 'paid', desc: 'Equipment service' }] },
        { name: 'Rain Bird', invoices: [{ id: 'RB-2024-08', date: 'Jan 25', amount: 26000, status: 'paid', desc: 'Irrigation maintenance' }] }
      ]},
      { code: '5400', name: 'Utilities', budget: 32000, actual: 28000, vendors: [
        { name: 'Florida Power & Light', invoices: [{ id: 'FPL-Jan', date: 'Jan 15', amount: 18000, status: 'paid', desc: 'Monthly electric' }] },
        { name: 'Palm Beach Water Utility', invoices: [{ id: 'PBWU-Jan', date: 'Jan 18', amount: 6500, status: 'paid', desc: 'Water/sewer' }] },
        { name: 'TECO Peoples Gas', invoices: [{ id: 'TECO-Jan', date: 'Jan 20', amount: 3500, status: 'paid', desc: 'Natural gas' }] }
      ]},
      { code: '5500', name: 'Insurance', budget: 31000, actual: 31000, vendors: [
        { name: 'Hartford Insurance', invoices: [{ id: 'HART-2024-Jan', date: 'Jan 1', amount: 31000, status: 'paid', desc: 'Monthly premium' }] }
      ]},
      { code: '5600', name: 'Admin & Professional', budget: 22000, actual: 21000, vendors: [
        { name: 'Smith & Associates CPA', invoices: [{ id: 'SA-2024-01', date: 'Jan 5', amount: 4500, status: 'paid', desc: 'Monthly accounting' }] },
        { name: 'Carlton Fields LLP', invoices: [{ id: 'CF-2024-01', date: 'Jan 15', amount: 8500, status: 'paid', desc: 'Legal retainer' }] },
        { name: 'Microsoft 365', invoices: [{ id: 'MS-Jan', date: 'Jan 1', amount: 1200, status: 'paid', desc: 'Subscription' }] },
        { name: 'Office Depot', invoices: [{ id: 'OD-Jan', date: 'Jan 22', amount: 6800, status: 'paid', desc: 'Office supplies' }] }
      ]}
    ]}
  },
  Feb: {
    revenue: { budget: 680000, actual: 672000, accounts: [
      { code: '4100', name: 'Membership Dues', budget: 516000, actual: 512000, vendors: [
        { name: 'Monthly Dues', invoices: [{ id: 'DUE-2024-Feb', date: 'Feb 1', amount: 512000, status: 'paid', desc: 'February dues' }] }
      ]},
      { code: '4200', name: 'F&B Revenue', budget: 105000, actual: 98000, vendors: [
        { name: 'Restaurant Sales', invoices: [{ id: 'POS-Feb', date: 'Feb 29', amount: 72000, status: 'posted' }] },
        { name: 'Valentine Event', invoices: [{ id: 'BNQ-2024-014', date: 'Feb 14', amount: 26000, status: 'paid', desc: 'Valentine dinner' }] }
      ]},
      { code: '4300', name: 'Golf Operations', budget: 42000, actual: 45000, vendors: [
        { name: 'Green Fees', invoices: [{ id: 'GF-Feb', date: 'Feb 29', amount: 32000, status: 'posted' }] },
        { name: 'Cart Rentals', invoices: [{ id: 'CART-Feb', date: 'Feb 29', amount: 13000, status: 'posted' }] }
      ]},
      { code: '4400', name: 'Other Income', budget: 17000, actual: 17000, vendors: [
        { name: 'Guest Fees', invoices: [{ id: 'GUE-Feb', date: 'Feb 29', amount: 17000, status: 'posted' }] }
      ]}
    ]},
    expenses: { budget: 505000, actual: 518000, accounts: [
      { code: '5100', name: 'Payroll & Benefits', budget: 200000, actual: 205000, vendors: [
        { name: 'ADP Payroll Services', invoices: [
          { id: 'ADP-2024-03', date: 'Feb 2', amount: 102500, status: 'paid', desc: 'Bi-weekly payroll' },
          { id: 'ADP-2024-04', date: 'Feb 16', amount: 102500, status: 'paid', desc: 'Bi-weekly payroll' }
        ]}
      ]},
      { code: '5200', name: 'Food & Beverage Cost', budget: 145000, actual: 152000, vendors: [
        { name: 'Sysco Foods', invoices: [
          { id: 'SYS-820789', date: 'Feb 5', amount: 38000, status: 'paid', desc: 'Weekly + Valentine prep' },
          { id: 'SYS-820923', date: 'Feb 12', amount: 42000, status: 'paid', desc: 'Valentine event' },
          { id: 'SYS-821089', date: 'Feb 19', amount: 36000, status: 'paid', desc: 'Weekly food order' },
          { id: 'SYS-821234', date: 'Feb 26', amount: 36000, status: 'paid', desc: 'Weekly food order' }
        ]}
      ]},
      { code: '5300', name: 'Golf Course Maintenance', budget: 75000, actual: 78000, vendors: [
        { name: 'SiteOne Landscape Supply', invoices: [{ id: 'S1-445456', date: 'Feb 8', amount: 22000, status: 'paid', desc: 'Spring prep materials' }] },
        { name: 'Green Horizons Landscaping', invoices: [{ id: 'GHL-Feb', date: 'Feb 15', amount: 28000, status: 'paid', desc: 'Monthly grounds' }] },
        { name: 'Toro Equipment Co.', invoices: [{ id: 'TORO-2024-018', date: 'Feb 22', amount: 28000, status: 'paid', desc: 'Mower maintenance' }] }
      ]},
      { code: '5400', name: 'Utilities', budget: 32000, actual: 31000, vendors: [
        { name: 'Florida Power & Light', invoices: [{ id: 'FPL-Feb', date: 'Feb 12', amount: 19500, status: 'paid' }] },
        { name: 'Palm Beach Water Utility', invoices: [{ id: 'PBWU-Feb', date: 'Feb 15', amount: 7000, status: 'paid' }] },
        { name: 'TECO Peoples Gas', invoices: [{ id: 'TECO-Feb', date: 'Feb 18', amount: 4500, status: 'paid' }] }
      ]},
      { code: '5500', name: 'Insurance', budget: 31000, actual: 31000, vendors: [
        { name: 'Hartford Insurance', invoices: [{ id: 'HART-2024-Feb', date: 'Feb 1', amount: 31000, status: 'paid' }] }
      ]},
      { code: '5600', name: 'Admin & Professional', budget: 22000, actual: 21000, vendors: [
        { name: 'Smith & Associates CPA', invoices: [{ id: 'SA-2024-02', date: 'Feb 5', amount: 4500, status: 'paid' }] },
        { name: 'Microsoft 365', invoices: [{ id: 'MS-Feb', date: 'Feb 1', amount: 1200, status: 'paid' }] },
        { name: 'Office supplies', invoices: [{ id: 'OD-Feb', date: 'Feb 18', amount: 15300, status: 'paid' }] }
      ]}
    ]}
  },
  Mar: {
    revenue: { budget: 695000, actual: 718000, accounts: [
      { code: '4100', name: 'Membership Dues', budget: 516000, actual: 530000, vendors: [{ name: 'Monthly Dues', invoices: [{ id: 'DUE-Mar', date: 'Mar 1', amount: 530000, status: 'paid' }] }] },
      { code: '4200', name: 'F&B Revenue', budget: 115000, actual: 125000, vendors: [{ name: 'Restaurant & Events', invoices: [{ id: 'FB-Mar', date: 'Mar 31', amount: 125000, status: 'posted' }] }] },
      { code: '4300', name: 'Golf Operations', budget: 45000, actual: 48000, vendors: [{ name: 'Golf Revenue', invoices: [{ id: 'GOLF-Mar', date: 'Mar 31', amount: 48000, status: 'posted' }] }] },
      { code: '4400', name: 'Other Income', budget: 19000, actual: 15000, vendors: [{ name: 'Other', invoices: [{ id: 'OTH-Mar', date: 'Mar 31', amount: 15000, status: 'posted' }] }] }
    ]},
    expenses: { budget: 515000, actual: 528000, accounts: [
      { code: '5100', name: 'Payroll & Benefits', budget: 200000, actual: 202000, vendors: [{ name: 'ADP Payroll', invoices: [{ id: 'ADP-Mar', date: 'Mar 31', amount: 202000, status: 'paid' }] }] },
      { code: '5200', name: 'Food & Beverage Cost', budget: 150000, actual: 158000, vendors: [{ name: 'Sysco Foods', invoices: [{ id: 'SYS-Mar', date: 'Mar 31', amount: 158000, status: 'paid' }] }] },
      { code: '5300', name: 'Golf Course Maintenance', budget: 78000, actual: 82000, vendors: [{ name: 'Course Vendors', invoices: [{ id: 'MAINT-Mar', date: 'Mar 31', amount: 82000, status: 'paid' }] }] },
      { code: '5400', name: 'Utilities', budget: 34000, actual: 35000, vendors: [{ name: 'Utilities', invoices: [{ id: 'UTIL-Mar', date: 'Mar 31', amount: 35000, status: 'paid' }] }] },
      { code: '5500', name: 'Insurance', budget: 31000, actual: 31000, vendors: [{ name: 'Hartford', invoices: [{ id: 'INS-Mar', date: 'Mar 1', amount: 31000, status: 'paid' }] }] },
      { code: '5600', name: 'Admin & Professional', budget: 22000, actual: 20000, vendors: [{ name: 'Admin', invoices: [{ id: 'ADM-Mar', date: 'Mar 31', amount: 20000, status: 'paid' }] }] }
    ]}
  },
  Apr: {
    revenue: { budget: 720000, actual: 745000, accounts: [
      { code: '4100', name: 'Membership Dues', budget: 520000, actual: 535000, vendors: [{ name: 'Monthly Dues', invoices: [{ id: 'DUE-Apr', date: 'Apr 1', amount: 535000, status: 'paid' }] }] },
      { code: '4200', name: 'F&B Revenue', budget: 125000, actual: 138000, vendors: [{ name: 'Restaurant & Events', invoices: [{ id: 'FB-Apr', date: 'Apr 30', amount: 138000, status: 'posted' }] }] },
      { code: '4300', name: 'Golf Operations', budget: 55000, actual: 52000, vendors: [{ name: 'Golf Revenue', invoices: [{ id: 'GOLF-Apr', date: 'Apr 30', amount: 52000, status: 'posted' }] }] },
      { code: '4400', name: 'Other Income', budget: 20000, actual: 20000, vendors: [{ name: 'Other', invoices: [{ id: 'OTH-Apr', date: 'Apr 30', amount: 20000, status: 'posted' }] }] }
    ]},
    expenses: { budget: 525000, actual: 542000, accounts: [
      { code: '5100', name: 'Payroll & Benefits', budget: 200000, actual: 198000, vendors: [{ name: 'ADP Payroll', invoices: [{ id: 'ADP-Apr', date: 'Apr 30', amount: 198000, status: 'paid' }] }] },
      { code: '5200', name: 'Food & Beverage Cost', budget: 155000, actual: 168000, vendors: [{ name: 'Sysco Foods', invoices: [{ id: 'SYS-Apr', date: 'Apr 30', amount: 168000, status: 'paid' }] }] },
      { code: '5300', name: 'Golf Course Maintenance', budget: 82000, actual: 88000, vendors: [{ name: 'Course Vendors', invoices: [{ id: 'MAINT-Apr', date: 'Apr 30', amount: 88000, status: 'paid' }] }] },
      { code: '5400', name: 'Utilities', budget: 35000, actual: 38000, vendors: [{ name: 'Utilities', invoices: [{ id: 'UTIL-Apr', date: 'Apr 30', amount: 38000, status: 'paid' }] }] },
      { code: '5500', name: 'Insurance', budget: 31000, actual: 31000, vendors: [{ name: 'Hartford', invoices: [{ id: 'INS-Apr', date: 'Apr 1', amount: 31000, status: 'paid' }] }] },
      { code: '5600', name: 'Admin & Professional', budget: 22000, actual: 19000, vendors: [{ name: 'Admin', invoices: [{ id: 'ADM-Apr', date: 'Apr 30', amount: 19000, status: 'paid' }] }] }
    ]}
  },
  May: {
    revenue: { budget: 745000, actual: 762000, accounts: [
      { code: '4100', name: 'Membership Dues', budget: 525000, actual: 538000, vendors: [{ name: 'Monthly Dues', invoices: [{ id: 'DUE-May', date: 'May 1', amount: 538000, status: 'paid' }] }] },
      { code: '4200', name: 'F&B Revenue', budget: 135000, actual: 142000, vendors: [{ name: 'Restaurant & Events', invoices: [{ id: 'FB-May', date: 'May 31', amount: 142000, status: 'posted' }] }] },
      { code: '4300', name: 'Golf Operations', budget: 62000, actual: 58000, vendors: [{ name: 'Golf Revenue', invoices: [{ id: 'GOLF-May', date: 'May 31', amount: 58000, status: 'posted' }] }] },
      { code: '4400', name: 'Other Income', budget: 23000, actual: 24000, vendors: [{ name: 'Other', invoices: [{ id: 'OTH-May', date: 'May 31', amount: 24000, status: 'posted' }] }] }
    ]},
    expenses: { budget: 535000, actual: 548000, accounts: [
      { code: '5100', name: 'Payroll & Benefits', budget: 200000, actual: 195000, vendors: [{ name: 'ADP Payroll', invoices: [{ id: 'ADP-May', date: 'May 31', amount: 195000, status: 'paid' }] }] },
      { code: '5200', name: 'Food & Beverage Cost', budget: 160000, actual: 172000, vendors: [{ name: 'Sysco Foods', invoices: [{ id: 'SYS-May', date: 'May 31', amount: 172000, status: 'paid' }] }] },
      { code: '5300', name: 'Golf Course Maintenance', budget: 85000, actual: 92000, vendors: [{ name: 'Course Vendors', invoices: [{ id: 'MAINT-May', date: 'May 31', amount: 92000, status: 'paid' }] }] },
      { code: '5400', name: 'Utilities', budget: 36000, actual: 38000, vendors: [{ name: 'Utilities', invoices: [{ id: 'UTIL-May', date: 'May 31', amount: 38000, status: 'paid' }] }] },
      { code: '5500', name: 'Insurance', budget: 31000, actual: 31000, vendors: [{ name: 'Hartford', invoices: [{ id: 'INS-May', date: 'May 1', amount: 31000, status: 'paid' }] }] },
      { code: '5600', name: 'Admin & Professional', budget: 23000, actual: 20000, vendors: [{ name: 'Admin', invoices: [{ id: 'ADM-May', date: 'May 31', amount: 20000, status: 'paid' }] }] }
    ]}
  },
  Jun: {
    revenue: { budget: 765000, actual: 778000, accounts: [
      { code: '4100', name: 'Membership Dues', budget: 530000, actual: 540000, vendors: [{ name: 'Monthly Dues', invoices: [{ id: 'DUE-Jun', date: 'Jun 1', amount: 540000, status: 'paid' }] }] },
      { code: '4200', name: 'F&B Revenue', budget: 145000, actual: 152000, vendors: [{ name: 'Restaurant & Events', invoices: [{ id: 'FB-Jun', date: 'Jun 30', amount: 152000, status: 'posted' }] }] },
      { code: '4300', name: 'Golf Operations', budget: 65000, actual: 62000, vendors: [{ name: 'Golf Revenue', invoices: [{ id: 'GOLF-Jun', date: 'Jun 30', amount: 62000, status: 'posted' }] }] },
      { code: '4400', name: 'Other Income', budget: 25000, actual: 24000, vendors: [{ name: 'Other', invoices: [{ id: 'OTH-Jun', date: 'Jun 30', amount: 24000, status: 'posted' }] }] }
    ]},
    expenses: { budget: 545000, actual: 562000, accounts: [
      { code: '5100', name: 'Payroll & Benefits', budget: 200000, actual: 198000, vendors: [{ name: 'ADP Payroll', invoices: [{ id: 'ADP-Jun', date: 'Jun 30', amount: 198000, status: 'paid' }] }] },
      { code: '5200', name: 'Food & Beverage Cost', budget: 165000, actual: 178000, vendors: [{ name: 'Sysco Foods', invoices: [{ id: 'SYS-Jun', date: 'Jun 30', amount: 178000, status: 'paid' }] }] },
      { code: '5300', name: 'Golf Course Maintenance', budget: 88000, actual: 95000, vendors: [{ name: 'Course Vendors', invoices: [{ id: 'MAINT-Jun', date: 'Jun 30', amount: 95000, status: 'paid' }] }] },
      { code: '5400', name: 'Utilities', budget: 38000, actual: 42000, vendors: [{ name: 'Utilities', invoices: [{ id: 'UTIL-Jun', date: 'Jun 30', amount: 42000, status: 'paid' }] }] },
      { code: '5500', name: 'Insurance', budget: 31000, actual: 31000, vendors: [{ name: 'Hartford', invoices: [{ id: 'INS-Jun', date: 'Jun 1', amount: 31000, status: 'paid' }] }] },
      { code: '5600', name: 'Admin & Professional', budget: 23000, actual: 18000, vendors: [{ name: 'Admin', invoices: [{ id: 'ADM-Jun', date: 'Jun 30', amount: 18000, status: 'paid' }] }] }
    ]}
  },
  Jul: {
    revenue: { budget: 780000, actual: 795000, accounts: [
      { code: '4100', name: 'Membership Dues', budget: 535000, actual: 548000, vendors: [{ name: 'Monthly Dues', invoices: [{ id: 'DUE-Jul', date: 'Jul 1', amount: 548000, status: 'paid' }] }] },
      { code: '4200', name: 'F&B Revenue', budget: 150000, actual: 158000, vendors: [{ name: 'Restaurant & Events', invoices: [{ id: 'FB-Jul', date: 'Jul 31', amount: 158000, status: 'posted' }] }] },
      { code: '4300', name: 'Golf Operations', budget: 68000, actual: 62000, vendors: [{ name: 'Golf Revenue', invoices: [{ id: 'GOLF-Jul', date: 'Jul 31', amount: 62000, status: 'posted' }] }] },
      { code: '4400', name: 'Other Income', budget: 27000, actual: 27000, vendors: [{ name: 'Other', invoices: [{ id: 'OTH-Jul', date: 'Jul 31', amount: 27000, status: 'posted' }] }] }
    ]},
    expenses: { budget: 555000, actual: 572000, accounts: [
      { code: '5100', name: 'Payroll & Benefits', budget: 200000, actual: 202000, vendors: [{ name: 'ADP Payroll', invoices: [{ id: 'ADP-Jul', date: 'Jul 31', amount: 202000, status: 'paid' }] }] },
      { code: '5200', name: 'Food & Beverage Cost', budget: 170000, actual: 182000, vendors: [{ name: 'Sysco Foods', invoices: [{ id: 'SYS-Jul', date: 'Jul 31', amount: 182000, status: 'paid' }] }] },
      { code: '5300', name: 'Golf Course Maintenance', budget: 90000, actual: 98000, vendors: [{ name: 'Course Vendors', invoices: [{ id: 'MAINT-Jul', date: 'Jul 31', amount: 98000, status: 'paid' }] }] },
      { code: '5400', name: 'Utilities', budget: 40000, actual: 45000, vendors: [{ name: 'Utilities', invoices: [{ id: 'UTIL-Jul', date: 'Jul 31', amount: 45000, status: 'paid' }] }] },
      { code: '5500', name: 'Insurance', budget: 32000, actual: 32000, vendors: [{ name: 'Hartford', invoices: [{ id: 'INS-Jul', date: 'Jul 1', amount: 32000, status: 'paid' }] }] },
      { code: '5600', name: 'Admin & Professional', budget: 23000, actual: 13000, vendors: [{ name: 'Admin', invoices: [{ id: 'ADM-Jul', date: 'Jul 31', amount: 13000, status: 'paid' }] }] }
    ]}
  },
  Aug: {
    revenue: { budget: 775000, actual: 788000, accounts: [
      { code: '4100', name: 'Membership Dues', budget: 532000, actual: 545000, vendors: [{ name: 'Monthly Dues', invoices: [{ id: 'DUE-Aug', date: 'Aug 1', amount: 545000, status: 'paid' }] }] },
      { code: '4200', name: 'F&B Revenue', budget: 148000, actual: 155000, vendors: [{ name: 'Restaurant & Events', invoices: [{ id: 'FB-Aug', date: 'Aug 31', amount: 155000, status: 'posted' }] }] },
      { code: '4300', name: 'Golf Operations', budget: 68000, actual: 61000, vendors: [{ name: 'Golf Revenue', invoices: [{ id: 'GOLF-Aug', date: 'Aug 31', amount: 61000, status: 'posted' }] }] },
      { code: '4400', name: 'Other Income', budget: 27000, actual: 27000, vendors: [{ name: 'Other', invoices: [{ id: 'OTH-Aug', date: 'Aug 31', amount: 27000, status: 'posted' }] }] }
    ]},
    expenses: { budget: 550000, actual: 568000, accounts: [
      { code: '5100', name: 'Payroll & Benefits', budget: 200000, actual: 198000, vendors: [{ name: 'ADP Payroll', invoices: [{ id: 'ADP-Aug', date: 'Aug 31', amount: 198000, status: 'paid' }] }] },
      { code: '5200', name: 'Food & Beverage Cost', budget: 168000, actual: 178000, vendors: [{ name: 'Sysco Foods', invoices: [{ id: 'SYS-Aug', date: 'Aug 31', amount: 178000, status: 'paid' }] }] },
      { code: '5300', name: 'Golf Course Maintenance', budget: 88000, actual: 102000, vendors: [{ name: 'Course Vendors', invoices: [{ id: 'MAINT-Aug', date: 'Aug 31', amount: 102000, status: 'paid' }] }] },
      { code: '5400', name: 'Utilities', budget: 40000, actual: 46000, vendors: [{ name: 'Utilities', invoices: [{ id: 'UTIL-Aug', date: 'Aug 31', amount: 46000, status: 'paid' }] }] },
      { code: '5500', name: 'Insurance', budget: 32000, actual: 32000, vendors: [{ name: 'Hartford', invoices: [{ id: 'INS-Aug', date: 'Aug 1', amount: 32000, status: 'paid' }] }] },
      { code: '5600', name: 'Admin & Professional', budget: 22000, actual: 12000, vendors: [{ name: 'Admin', invoices: [{ id: 'ADM-Aug', date: 'Aug 31', amount: 12000, status: 'paid' }] }] }
    ]}
  },
  Sep: {
    revenue: { budget: 755000, actual: 742000, accounts: [
      { code: '4100', name: 'Membership Dues', budget: 528000, actual: 520000, vendors: [{ name: 'Monthly Dues', invoices: [{ id: 'DUE-Sep', date: 'Sep 1', amount: 520000, status: 'paid' }] }] },
      { code: '4200', name: 'F&B Revenue', budget: 138000, actual: 135000, vendors: [{ name: 'Restaurant & Events', invoices: [{ id: 'FB-Sep', date: 'Sep 30', amount: 135000, status: 'posted' }] }] },
      { code: '4300', name: 'Golf Operations', budget: 62000, actual: 58000, vendors: [{ name: 'Golf Revenue', invoices: [{ id: 'GOLF-Sep', date: 'Sep 30', amount: 58000, status: 'posted' }] }] },
      { code: '4400', name: 'Other Income', budget: 27000, actual: 29000, vendors: [{ name: 'Other', invoices: [{ id: 'OTH-Sep', date: 'Sep 30', amount: 29000, status: 'posted' }] }] }
    ]},
    expenses: { budget: 540000, actual: 558000, accounts: [
      { code: '5100', name: 'Payroll & Benefits', budget: 200000, actual: 198000, vendors: [{ name: 'ADP Payroll', invoices: [{ id: 'ADP-Sep', date: 'Sep 30', amount: 198000, status: 'paid' }] }] },
      { code: '5200', name: 'Food & Beverage Cost', budget: 162000, actual: 175000, vendors: [{ name: 'Sysco Foods', invoices: [{ id: 'SYS-Sep', date: 'Sep 30', amount: 175000, status: 'paid' }] }] },
      { code: '5300', name: 'Golf Course Maintenance', budget: 85000, actual: 95000, vendors: [{ name: 'Course Vendors', invoices: [{ id: 'MAINT-Sep', date: 'Sep 30', amount: 95000, status: 'paid' }] }] },
      { code: '5400', name: 'Utilities', budget: 38000, actual: 42000, vendors: [{ name: 'Utilities', invoices: [{ id: 'UTIL-Sep', date: 'Sep 30', amount: 42000, status: 'paid' }] }] },
      { code: '5500', name: 'Insurance', budget: 32000, actual: 32000, vendors: [{ name: 'Hartford', invoices: [{ id: 'INS-Sep', date: 'Sep 1', amount: 32000, status: 'paid' }] }] },
      { code: '5600', name: 'Admin & Professional', budget: 23000, actual: 16000, vendors: [{ name: 'Admin', invoices: [{ id: 'ADM-Sep', date: 'Sep 30', amount: 16000, status: 'paid' }] }] }
    ]}
  },
  Oct: {
    revenue: { budget: 735000, actual: 752000, accounts: [
      { code: '4100', name: 'Membership Dues', budget: 522000, actual: 535000, vendors: [{ name: 'Monthly Dues', invoices: [{ id: 'DUE-Oct', date: 'Oct 1', amount: 535000, status: 'paid' }] }] },
      { code: '4200', name: 'F&B Revenue', budget: 130000, actual: 138000, vendors: [{ name: 'Restaurant & Events', invoices: [{ id: 'FB-Oct', date: 'Oct 31', amount: 138000, status: 'posted' }] }] },
      { code: '4300', name: 'Golf Operations', budget: 58000, actual: 52000, vendors: [{ name: 'Golf Revenue', invoices: [{ id: 'GOLF-Oct', date: 'Oct 31', amount: 52000, status: 'posted' }] }] },
      { code: '4400', name: 'Other Income', budget: 25000, actual: 27000, vendors: [{ name: 'Other', invoices: [{ id: 'OTH-Oct', date: 'Oct 31', amount: 27000, status: 'posted' }] }] }
    ]},
    expenses: { budget: 530000, actual: 552000, accounts: [
      { code: '5100', name: 'Payroll & Benefits', budget: 200000, actual: 196000, vendors: [{ name: 'ADP Payroll', invoices: [{ id: 'ADP-Oct', date: 'Oct 31', amount: 196000, status: 'paid' }] }] },
      { code: '5200', name: 'Food & Beverage Cost', budget: 158000, actual: 172000, vendors: [{ name: 'Sysco Foods', invoices: [{ id: 'SYS-Oct', date: 'Oct 31', amount: 172000, status: 'paid' }] }] },
      { code: '5300', name: 'Golf Course Maintenance', budget: 82000, actual: 92000, vendors: [{ name: 'Course Vendors', invoices: [{ id: 'MAINT-Oct', date: 'Oct 31', amount: 92000, status: 'paid' }] }] },
      { code: '5400', name: 'Utilities', budget: 36000, actual: 42000, vendors: [{ name: 'Utilities', invoices: [{ id: 'UTIL-Oct', date: 'Oct 31', amount: 42000, status: 'paid' }] }] },
      { code: '5500', name: 'Insurance', budget: 32000, actual: 32000, vendors: [{ name: 'Hartford', invoices: [{ id: 'INS-Oct', date: 'Oct 1', amount: 32000, status: 'paid' }] }] },
      { code: '5600', name: 'Admin & Professional', budget: 22000, actual: 18000, vendors: [{ name: 'Admin', invoices: [{ id: 'ADM-Oct', date: 'Oct 31', amount: 18000, status: 'paid' }] }] }
    ]}
  },
  Nov: {
    revenue: { budget: 710000, actual: 698000, accounts: [
      { code: '4100', name: 'Membership Dues', budget: 518000, actual: 508000, vendors: [{ name: 'Monthly Dues', invoices: [{ id: 'DUE-Nov', date: 'Nov 1', amount: 508000, status: 'paid' }] }] },
      { code: '4200', name: 'F&B Revenue', budget: 118000, actual: 115000, vendors: [{ name: 'Restaurant & Events', invoices: [{ id: 'FB-Nov', date: 'Nov 30', amount: 115000, status: 'posted' }] }] },
      { code: '4300', name: 'Golf Operations', budget: 52000, actual: 48000, vendors: [{ name: 'Golf Revenue', invoices: [{ id: 'GOLF-Nov', date: 'Nov 30', amount: 48000, status: 'posted' }] }] },
      { code: '4400', name: 'Other Income', budget: 22000, actual: 27000, vendors: [{ name: 'Other', invoices: [{ id: 'OTH-Nov', date: 'Nov 30', amount: 27000, status: 'posted' }] }] }
    ]},
    expenses: { budget: 520000, actual: 545000, accounts: [
      { code: '5100', name: 'Payroll & Benefits', budget: 200000, actual: 195000, vendors: [{ name: 'ADP Payroll', invoices: [{ id: 'ADP-Nov', date: 'Nov 30', amount: 195000, status: 'paid' }] }] },
      { code: '5200', name: 'Food & Beverage Cost', budget: 152000, actual: 168000, vendors: [{ name: 'Sysco Foods', invoices: [{ id: 'SYS-Nov', date: 'Nov 30', amount: 168000, status: 'paid' }] }] },
      { code: '5300', name: 'Golf Course Maintenance', budget: 78000, actual: 88000, vendors: [{ name: 'Course Vendors', invoices: [{ id: 'MAINT-Nov', date: 'Nov 30', amount: 88000, status: 'paid' }] }] },
      { code: '5400', name: 'Utilities', budget: 35000, actual: 42000, vendors: [{ name: 'Utilities', invoices: [{ id: 'UTIL-Nov', date: 'Nov 30', amount: 42000, status: 'paid' }] }] },
      { code: '5500', name: 'Insurance', budget: 32000, actual: 32000, vendors: [{ name: 'Hartford', invoices: [{ id: 'INS-Nov', date: 'Nov 1', amount: 32000, status: 'paid' }] }] },
      { code: '5600', name: 'Admin & Professional', budget: 23000, actual: 20000, vendors: [{ name: 'Admin', invoices: [{ id: 'ADM-Nov', date: 'Nov 30', amount: 20000, status: 'paid' }] }] }
    ]}
  },
  Dec: {
    revenue: { budget: 760000, actual: 775000, accounts: [
      { code: '4100', name: 'Membership Dues', budget: 527000, actual: 541000, vendors: [
        { name: 'Monthly Dues - Regular', invoices: [{ id: 'DUE-2024-Dec', date: 'Dec 1', amount: 485000, status: 'paid', desc: 'Monthly member dues' }] },
        { name: 'New Member Initiation', invoices: [{ id: 'INIT-2024-047', date: 'Dec 5', amount: 56000, status: 'paid', desc: '2 new members' }] }
      ]},
      { code: '4200', name: 'F&B Revenue', budget: 148000, actual: 152000, vendors: [
        { name: 'Restaurant Sales', invoices: [
          { id: 'POS-Dec-W1', date: 'Dec 1-7', amount: 38500, status: 'posted', desc: 'Week 1 restaurant' },
          { id: 'POS-Dec-W2', date: 'Dec 8-14', amount: 42100, status: 'posted', desc: 'Week 2 restaurant' }
        ]},
        { name: 'Banquet Events', invoices: [
          { id: 'BNQ-2024-127', date: 'Dec 7', amount: 28500, status: 'paid', desc: 'Johnson Wedding Reception' },
          { id: 'BNQ-2024-128', date: 'Dec 14', amount: 42900, status: 'pending', desc: 'Corporate Holiday Gala' }
        ]}
      ]},
      { code: '4300', name: 'Golf Operations', budget: 56000, actual: 52000, vendors: [
        { name: 'Green Fees', invoices: [
          { id: 'GF-Dec-W1', date: 'Dec 1-7', amount: 12400, status: 'posted' },
          { id: 'GF-Dec-W2', date: 'Dec 8-14', amount: 11800, status: 'posted' }
        ]},
        { name: 'Cart Rentals', invoices: [{ id: 'CART-Dec', date: 'Dec 14', amount: 8200, status: 'posted' }] },
        { name: 'Pro Shop Sales', invoices: [{ id: 'PS-Dec', date: 'Dec 14', amount: 19600, status: 'posted', desc: 'Holiday merchandise' }] }
      ]},
      { code: '4400', name: 'Other Income', budget: 29000, actual: 30000, vendors: [
        { name: 'Locker Rentals', invoices: [{ id: 'LKR-2024-Q4', date: 'Dec 1', amount: 18000, status: 'paid', desc: 'Q4 locker fees' }] },
        { name: 'Guest Fees', invoices: [{ id: 'GUE-Dec', date: 'Dec 14', amount: 12000, status: 'posted' }] }
      ]}
    ]},
    expenses: { budget: 535000, actual: 565000, accounts: [
      { code: '5100', name: 'Payroll & Benefits', budget: 200000, actual: 195000, vendors: [
        { name: 'ADP Payroll Services', invoices: [
          { id: 'ADP-2024-23', date: 'Dec 1', amount: 97500, status: 'paid', desc: 'Bi-weekly payroll 12/1' },
          { id: 'ADP-2024-24', date: 'Dec 15', amount: 97500, status: 'pending', desc: 'Bi-weekly payroll 12/15' }
        ]}
      ]},
      { code: '5200', name: 'Food & Beverage Cost', budget: 158000, actual: 175000, vendors: [
        { name: 'Sysco Foods', invoices: [
          { id: 'SYS-847291', date: 'Dec 8', amount: 34200, status: 'paid', desc: 'Weekly food order' },
          { id: 'SYS-847456', date: 'Dec 15', amount: 31800, status: 'pending', desc: 'Weekly food order' }
        ]},
        { name: 'Southern Wine & Spirits', invoices: [
          { id: 'SWS-12847', date: 'Dec 5', amount: 24500, status: 'paid', desc: 'Holiday beverage stock' }
        ]},
        { name: 'US Foods', invoices: [
          { id: 'USF-98721', date: 'Dec 10', amount: 18200, status: 'paid', desc: 'Specialty holiday items' }
        ]},
        { name: 'Coastal Seafood', invoices: [
          { id: 'CSF-2024-89', date: 'Dec 12', amount: 12800, status: 'paid', desc: 'Fresh seafood order' }
        ]}
      ]},
      { code: '5300', name: 'Golf Course Maintenance', budget: 84000, actual: 98000, vendors: [
        { name: 'Toro Equipment Co.', invoices: [
          { id: 'TORO-2024-1847', date: 'Dec 9', amount: 47500, status: 'paid', desc: 'Mower parts & annual service' }
        ]},
        { name: 'Premium Landscaping LLC', invoices: [
          { id: 'PL-2024-089', date: 'Dec 8', amount: 28000, status: 'flagged', desc: 'Monthly grounds service', flagged: true }
        ]},
        { name: 'SiteOne Landscape Supply', invoices: [
          { id: 'S1-458721', date: 'Dec 3', amount: 8900, status: 'paid', desc: 'Winter fertilizer' }
        ]},
        { name: 'Rain Bird', invoices: [
          { id: 'RB-2024-42', date: 'Dec 11', amount: 13600, status: 'paid', desc: 'Irrigation winterization' }
        ]}
      ]},
      { code: '5400', name: 'Utilities', budget: 38000, actual: 46000, vendors: [
        { name: 'Florida Power & Light', invoices: [
          { id: 'FPL-Dec', date: 'Dec 6', amount: 28750, status: 'paid', desc: 'Monthly electric - holiday lighting' }
        ]},
        { name: 'Palm Beach Water Utility', invoices: [
          { id: 'PBWU-Dec', date: 'Dec 10', amount: 12400, status: 'pending', desc: 'Water/sewer service' }
        ]},
        { name: 'TECO Peoples Gas', invoices: [
          { id: 'TECO-Dec', date: 'Dec 8', amount: 4850, status: 'paid', desc: 'Natural gas' }
        ]}
      ]},
      { code: '5500', name: 'Insurance', budget: 32000, actual: 38000, vendors: [
        { name: 'Hartford Insurance', invoices: [
          { id: 'HART-Dec', date: 'Dec 1', amount: 32000, status: 'paid', desc: 'Monthly premium' }
        ]},
        { name: 'Travelers - Event Coverage', invoices: [
          { id: 'TRAV-Dec-Event', date: 'Dec 5', amount: 6000, status: 'paid', desc: 'Holiday gala coverage' }
        ]}
      ]},
      { code: '5600', name: 'Admin & Professional', budget: 23000, actual: 13000, vendors: [
        { name: 'Smith & Associates CPA', invoices: [
          { id: 'SA-2024-12', date: 'Dec 1', amount: 4500, status: 'paid', desc: 'Monthly accounting' }
        ]},
        { name: 'Microsoft 365', invoices: [
          { id: 'MS-Dec', date: 'Dec 1', amount: 1200, status: 'paid', desc: 'Monthly subscription' }
        ]},
        { name: 'Staples', invoices: [
          { id: 'STP-Dec', date: 'Dec 8', amount: 2800, status: 'paid', desc: 'Office supplies' }
        ]},
        { name: 'FedEx', invoices: [
          { id: 'FDX-Dec', date: 'Dec 12', amount: 4500, status: 'paid', desc: 'Holiday mailings' }
        ]}
      ]}
    ]}
  }
};

// Build chart data
const chartData = months.map(m => {
  const d = monthlyData[m];
  return {
    month: m,
    revenue: d?.revenue.actual || 0,
    expenses: d?.expenses.actual || 0,
    net: (d?.revenue.actual || 0) - (d?.expenses.actual || 0),
    revBudget: d?.revenue.budget || 0,
    expBudget: d?.expenses.budget || 0,
  };
});

const fmt = (v) => {
  const abs = Math.abs(v);
  if (abs >= 1e6) return `$${(v/1e6).toFixed(2)}M`;
  if (abs >= 1e3) return `$${(v/1e3).toFixed(0)}K`;
  return `$${v.toLocaleString()}`;
};

const fmtFull = (v) => `$${v.toLocaleString()}`;

export default function MonthlyIncomeStatement() {
  const [selectedMonth, setSelectedMonth] = useState('Dec');
  const [expandedSection, setExpandedSection] = useState(null);
  const [expandedAccount, setExpandedAccount] = useState(null);
  const [expandedVendor, setExpandedVendor] = useState(null);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const currentData = monthlyData[selectedMonth];
  const netIncome = currentData ? currentData.revenue.actual - currentData.expenses.actual : 0;
  const netBudget = currentData ? currentData.revenue.budget - currentData.expenses.budget : 0;
  const variance = (currentData?.revenue.actual - currentData?.revenue.budget) - (currentData?.expenses.actual - currentData?.expenses.budget);

  const resetDrillDown = () => {
    setExpandedSection(null);
    setExpandedAccount(null);
    setExpandedVendor(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-100 to-stone-200 p-6">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Fraunces:wght@400;500;600;700&display=swap');
        * { font-family: 'DM Sans', sans-serif; box-sizing: border-box; }
        .font-display { font-family: 'Fraunces', serif; }
        .card { background: white; border-radius: 16px; box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.04); }
        .month-btn { padding: 8px 4px; border-radius: 8px; font-size: 13px; font-weight: 500; transition: all 0.2s; cursor: pointer; border: none; background: transparent; }
        .month-btn:hover { background: #f5f5f4; }
        .month-btn.active { background: #292524; color: white; }
        .row-hover { transition: background 0.15s; cursor: pointer; }
        .row-hover:hover { background: #fafaf9; }
        .expand-icon { transition: transform 0.2s; display: inline-block; }
        .expand-icon.expanded { transform: rotate(90deg); }
        .drill-l1 { border-left: 3px solid #e7e5e4; }
        .drill-l2 { border-left: 3px solid #d6d3d1; margin-left: 16px; }
        .drill-l3 { border-left: 3px solid #a8a29e; margin-left: 32px; }
        .status-paid { background: #dcfce7; color: #166534; }
        .status-pending { background: #fef3c7; color: #92400e; }
        .status-posted { background: #dbeafe; color: #1e40af; }
        .status-flagged { background: #fee2e2; color: #991b1b; }
      `}</style>

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display text-2xl font-semibold text-stone-800">Monthly Income Statement</h1>
            <p className="text-stone-500">Palm Harbor Country Club · 2024</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-white border border-stone-200 rounded-xl text-sm font-medium text-stone-600 hover:bg-stone-50">
              Export PDF
            </button>
          </div>
        </div>

        {/* Month Selector */}
        <div className="card p-3 mb-6">
          <div className="flex gap-1">
            {months.map(m => (
              <button
                key={m}
                onClick={() => { setSelectedMonth(m); resetDrillDown(); }}
                className={`month-btn flex-1 ${selectedMonth === m ? 'active' : ''}`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* Summary Cards */}
        {currentData && (
          <div className="grid grid-cols-5 gap-4 mb-6">
            <div className="card p-4" style={{ background: 'linear-gradient(135deg, #ecfdf5, #d1fae5)', border: '1px solid #a7f3d0' }}>
              <div className="text-xs text-emerald-700 uppercase font-medium tracking-wide">Revenue</div>
              <div className="font-display text-2xl font-semibold text-emerald-800 mt-1">{fmt(currentData.revenue.actual)}</div>
              <div className="text-sm text-emerald-600 mt-1">
                {currentData.revenue.actual >= currentData.revenue.budget ? '↑' : '↓'} {fmt(Math.abs(currentData.revenue.actual - currentData.revenue.budget))} vs budget
              </div>
            </div>
            <div className="card p-4" style={{ background: 'linear-gradient(135deg, #fef2f2, #fecaca)', border: '1px solid #fca5a5' }}>
              <div className="text-xs text-red-700 uppercase font-medium tracking-wide">Expenses</div>
              <div className="font-display text-2xl font-semibold text-red-800 mt-1">{fmt(currentData.expenses.actual)}</div>
              <div className="text-sm text-red-600 mt-1">
                {currentData.expenses.actual <= currentData.expenses.budget ? '↓' : '↑'} {fmt(Math.abs(currentData.expenses.actual - currentData.expenses.budget))} vs budget
              </div>
            </div>
            <div className="card p-4" style={{ background: netIncome >= 0 ? 'linear-gradient(135deg, #eff6ff, #dbeafe)' : 'linear-gradient(135deg, #fefce8, #fef08a)', border: netIncome >= 0 ? '1px solid #93c5fd' : '1px solid #fde047' }}>
              <div className={`text-xs uppercase font-medium tracking-wide ${netIncome >= 0 ? 'text-blue-700' : 'text-amber-700'}`}>Net Income</div>
              <div className={`font-display text-2xl font-semibold mt-1 ${netIncome >= 0 ? 'text-blue-800' : 'text-amber-800'}`}>{fmt(netIncome)}</div>
              <div className={`text-sm mt-1 ${netIncome >= 0 ? 'text-blue-600' : 'text-amber-600'}`}>
                {((netIncome / currentData.revenue.actual) * 100).toFixed(1)}% margin
              </div>
            </div>
            <div className="card p-4">
              <div className="text-xs text-stone-500 uppercase font-medium tracking-wide">Budget Variance</div>
              <div className={`font-display text-2xl font-semibold mt-1 ${variance >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                {variance >= 0 ? '+' : ''}{fmt(variance)}
              </div>
              <div className="text-sm text-stone-500 mt-1">Net vs plan</div>
            </div>
            <div className="card p-4">
              <div className="text-xs text-stone-500 uppercase font-medium tracking-wide">Period</div>
              <div className="font-display text-2xl font-semibold text-stone-800 mt-1">{selectedMonth} 2024</div>
              <div className="text-sm text-stone-500 mt-1">Click rows to drill down</div>
            </div>
          </div>
        )}

        {/* Income Statement Table */}
        {currentData && (
          <div className="card overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 p-4 bg-stone-100 text-xs font-semibold text-stone-500 uppercase tracking-wider border-b border-stone-200">
              <div className="col-span-5">Account</div>
              <div className="col-span-2 text-right">Budget</div>
              <div className="col-span-2 text-right">Actual</div>
              <div className="col-span-2 text-right">Variance</div>
              <div className="col-span-1 text-right">%</div>
            </div>

            {/* REVENUE SECTION */}
            <div 
              className="grid grid-cols-12 gap-4 p-4 row-hover border-b border-stone-100"
              style={{ background: 'linear-gradient(90deg, #ecfdf5, white)' }}
              onClick={() => setExpandedSection(expandedSection === 'revenue' ? null : 'revenue')}
            >
              <div className="col-span-5 font-semibold text-emerald-800 flex items-center gap-2">
                <span className={`expand-icon ${expandedSection === 'revenue' ? 'expanded' : ''}`}>→</span>
                Revenue
              </div>
              <div className="col-span-2 text-right text-stone-600">{fmt(currentData.revenue.budget)}</div>
              <div className="col-span-2 text-right font-semibold text-emerald-700">{fmt(currentData.revenue.actual)}</div>
              <div className={`col-span-2 text-right font-medium ${currentData.revenue.actual >= currentData.revenue.budget ? 'text-emerald-600' : 'text-red-600'}`}>
                {currentData.revenue.actual >= currentData.revenue.budget ? '+' : ''}{fmt(currentData.revenue.actual - currentData.revenue.budget)}
              </div>
              <div className={`col-span-1 text-right ${currentData.revenue.actual >= currentData.revenue.budget ? 'text-emerald-600' : 'text-red-600'}`}>
                {(((currentData.revenue.actual - currentData.revenue.budget) / currentData.revenue.budget) * 100).toFixed(1)}%
              </div>
            </div>

            {/* Revenue Accounts */}
            {expandedSection === 'revenue' && currentData.revenue.accounts.map((acct, ai) => (
              <div key={ai}>
                {/* Account Row */}
                <div 
                  className="grid grid-cols-12 gap-4 p-4 pl-8 row-hover border-b border-stone-50 drill-l1"
                  onClick={() => setExpandedAccount(expandedAccount === `rev-${ai}` ? null : `rev-${ai}`)}
                >
                  <div className="col-span-5 flex items-center gap-2">
                    <span className={`expand-icon text-stone-400 ${expandedAccount === `rev-${ai}` ? 'expanded' : ''}`}>→</span>
                    <span className="text-stone-400 text-sm font-mono">{acct.code}</span>
                    <span className="text-stone-700 font-medium">{acct.name}</span>
                  </div>
                  <div className="col-span-2 text-right text-stone-500">{fmt(acct.budget)}</div>
                  <div className="col-span-2 text-right font-medium text-stone-800">{fmt(acct.actual)}</div>
                  <div className={`col-span-2 text-right ${acct.actual >= acct.budget ? 'text-emerald-600' : 'text-red-600'}`}>
                    {acct.actual >= acct.budget ? '+' : ''}{fmt(acct.actual - acct.budget)}
                  </div>
                  <div className={`col-span-1 text-right text-sm ${acct.actual >= acct.budget ? 'text-emerald-600' : 'text-red-600'}`}>
                    {(((acct.actual - acct.budget) / acct.budget) * 100).toFixed(1)}%
                  </div>
                </div>

                {/* Vendors */}
                {expandedAccount === `rev-${ai}` && acct.vendors?.map((vendor, vi) => (
                  <div key={vi}>
                    <div 
                      className="grid grid-cols-12 gap-4 p-3 pl-12 row-hover border-b border-stone-50 drill-l2"
                      onClick={() => setExpandedVendor(expandedVendor === `rev-${ai}-${vi}` ? null : `rev-${ai}-${vi}`)}
                    >
                      <div className="col-span-5 flex items-center gap-2 text-sm">
                        <span className={`expand-icon text-stone-300 ${expandedVendor === `rev-${ai}-${vi}` ? 'expanded' : ''}`}>→</span>
                        <span className="text-stone-600">{vendor.name}</span>
                      </div>
                      <div className="col-span-4"></div>
                      <div className="col-span-2 text-right text-sm text-stone-600 font-medium">
                        {fmt(vendor.invoices.reduce((sum, inv) => sum + inv.amount, 0))}
                      </div>
                      <div className="col-span-1 text-right text-xs text-stone-400">
                        {vendor.invoices.length} inv
                      </div>
                    </div>

                    {/* Invoices */}
                    {expandedVendor === `rev-${ai}-${vi}` && vendor.invoices.map((inv, ii) => (
                      <div 
                        key={ii} 
                        className="grid grid-cols-12 gap-4 p-3 pl-16 row-hover border-b border-stone-50 drill-l3"
                        onClick={() => setSelectedInvoice(inv)}
                      >
                        <div className="col-span-5 flex items-center gap-2 text-sm">
                          <span className="text-blue-600 font-mono text-xs">{inv.id}</span>
                          {inv.desc && <span className="text-stone-400 truncate">· {inv.desc}</span>}
                        </div>
                        <div className="col-span-2 text-right text-xs text-stone-400">{inv.date}</div>
                        <div className="col-span-2 text-right text-sm font-medium text-stone-700">{fmtFull(inv.amount)}</div>
                        <div className="col-span-3 text-right">
                          <span className={`text-xs px-2 py-1 rounded-full status-${inv.status}`}>{inv.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ))}

            {/* EXPENSES SECTION */}
            <div 
              className="grid grid-cols-12 gap-4 p-4 row-hover border-b border-stone-100"
              style={{ background: 'linear-gradient(90deg, #fef2f2, white)' }}
              onClick={() => setExpandedSection(expandedSection === 'expenses' ? null : 'expenses')}
            >
              <div className="col-span-5 font-semibold text-red-800 flex items-center gap-2">
                <span className={`expand-icon ${expandedSection === 'expenses' ? 'expanded' : ''}`}>→</span>
                Operating Expenses
              </div>
              <div className="col-span-2 text-right text-stone-600">{fmt(currentData.expenses.budget)}</div>
              <div className="col-span-2 text-right font-semibold text-red-700">{fmt(currentData.expenses.actual)}</div>
              <div className={`col-span-2 text-right font-medium ${currentData.expenses.actual <= currentData.expenses.budget ? 'text-emerald-600' : 'text-red-600'}`}>
                {currentData.expenses.actual > currentData.expenses.budget ? '+' : ''}{fmt(currentData.expenses.actual - currentData.expenses.budget)}
              </div>
              <div className={`col-span-1 text-right ${currentData.expenses.actual <= currentData.expenses.budget ? 'text-emerald-600' : 'text-red-600'}`}>
                {(((currentData.expenses.actual - currentData.expenses.budget) / currentData.expenses.budget) * 100).toFixed(1)}%
              </div>
            </div>

            {/* Expense Accounts */}
            {expandedSection === 'expenses' && currentData.expenses.accounts.map((acct, ai) => (
              <div key={ai}>
                {/* Account Row */}
                <div 
                  className="grid grid-cols-12 gap-4 p-4 pl-8 row-hover border-b border-stone-50 drill-l1"
                  onClick={() => setExpandedAccount(expandedAccount === `exp-${ai}` ? null : `exp-${ai}`)}
                >
                  <div className="col-span-5 flex items-center gap-2">
                    <span className={`expand-icon text-stone-400 ${expandedAccount === `exp-${ai}` ? 'expanded' : ''}`}>→</span>
                    <span className="text-stone-400 text-sm font-mono">{acct.code}</span>
                    <span className="text-stone-700 font-medium">{acct.name}</span>
                    {acct.actual > acct.budget * 1.05 && (
                      <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">Over</span>
                    )}
                  </div>
                  <div className="col-span-2 text-right text-stone-500">{fmt(acct.budget)}</div>
                  <div className="col-span-2 text-right font-medium text-stone-800">{fmt(acct.actual)}</div>
                  <div className={`col-span-2 text-right ${acct.actual <= acct.budget ? 'text-emerald-600' : 'text-red-600'}`}>
                    {acct.actual > acct.budget ? '+' : ''}{fmt(acct.actual - acct.budget)}
                  </div>
                  <div className={`col-span-1 text-right text-sm ${acct.actual <= acct.budget ? 'text-emerald-600' : 'text-red-600'}`}>
                    {(((acct.actual - acct.budget) / acct.budget) * 100).toFixed(1)}%
                  </div>
                </div>

                {/* Vendors */}
                {expandedAccount === `exp-${ai}` && acct.vendors?.map((vendor, vi) => (
                  <div key={vi}>
                    <div 
                      className="grid grid-cols-12 gap-4 p-3 pl-12 row-hover border-b border-stone-50 drill-l2"
                      onClick={() => setExpandedVendor(expandedVendor === `exp-${ai}-${vi}` ? null : `exp-${ai}-${vi}`)}
                    >
                      <div className="col-span-5 flex items-center gap-2 text-sm">
                        <span className={`expand-icon text-stone-300 ${expandedVendor === `exp-${ai}-${vi}` ? 'expanded' : ''}`}>→</span>
                        <span className="text-stone-600">{vendor.name}</span>
                      </div>
                      <div className="col-span-4"></div>
                      <div className="col-span-2 text-right text-sm text-stone-600 font-medium">
                        {fmt(vendor.invoices.reduce((sum, inv) => sum + inv.amount, 0))}
                      </div>
                      <div className="col-span-1 text-right text-xs text-stone-400">
                        {vendor.invoices.length} inv
                      </div>
                    </div>

                    {/* Invoices */}
                    {expandedVendor === `exp-${ai}-${vi}` && vendor.invoices.map((inv, ii) => (
                      <div 
                        key={ii} 
                        className={`grid grid-cols-12 gap-4 p-3 pl-16 row-hover border-b border-stone-50 drill-l3 ${inv.flagged ? 'bg-amber-50' : ''}`}
                        onClick={() => setSelectedInvoice(inv)}
                      >
                        <div className="col-span-5 flex items-center gap-2 text-sm">
                          {inv.flagged && <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>}
                          <span className="text-blue-600 font-mono text-xs">{inv.id}</span>
                          {inv.desc && <span className="text-stone-400 truncate">· {inv.desc}</span>}
                        </div>
                        <div className="col-span-2 text-right text-xs text-stone-400">{inv.date}</div>
                        <div className="col-span-2 text-right text-sm font-medium text-stone-700">{fmtFull(inv.amount)}</div>
                        <div className="col-span-3 text-right">
                          <span className={`text-xs px-2 py-1 rounded-full status-${inv.status}`}>{inv.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ))}

            {/* NET INCOME */}
            <div 
              className="grid grid-cols-12 gap-4 p-4 border-t-2 border-blue-200"
              style={{ background: 'linear-gradient(90deg, #eff6ff, white)' }}
            >
              <div className="col-span-5 font-bold text-blue-800 text-lg">Net Income</div>
              <div className="col-span-2 text-right text-stone-600 font-medium">{fmt(netBudget)}</div>
              <div className="col-span-2 text-right font-bold text-blue-700 text-lg">{fmt(netIncome)}</div>
              <div className={`col-span-2 text-right font-semibold ${variance >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                {variance >= 0 ? '+' : ''}{fmt(variance)}
              </div>
              <div className="col-span-1"></div>
            </div>
          </div>
        )}

        {/* Monthly Chart */}
        <div className="card p-6 mt-6">
          <h3 className="font-semibold text-stone-800 mb-4">Monthly Net Income Trend</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#78716c', fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#78716c', fontSize: 12 }} tickFormatter={v => `$${v/1000}K`} />
              <Tooltip formatter={(v) => [fmtFull(v), '']} />
              <Bar dataKey="net" radius={[4, 4, 0, 0]} name="Net Income">
                {chartData.map((entry, index) => (
                  <Cell 
                    key={index} 
                    fill={entry.month === selectedMonth ? '#1e40af' : (entry.net >= 0 ? '#10b981' : '#f59e0b')} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Invoice Detail Modal */}
      {selectedInvoice && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedInvoice(null)}
        >
          <div 
            className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-lg font-semibold text-stone-800">Invoice Detail</h3>
              <button 
                onClick={() => setSelectedInvoice(null)}
                className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 hover:bg-stone-200"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-stone-100">
                <span className="text-stone-500">Invoice #</span>
                <span className="font-mono text-blue-600 font-medium">{selectedInvoice.id}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-stone-100">
                <span className="text-stone-500">Date</span>
                <span className="text-stone-800">{selectedInvoice.date}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-stone-100">
                <span className="text-stone-500">Amount</span>
                <span className="text-stone-800 font-semibold text-lg">{fmtFull(selectedInvoice.amount)}</span>
              </div>
              {selectedInvoice.desc && (
                <div className="flex justify-between items-center py-2 border-b border-stone-100">
                  <span className="text-stone-500">Description</span>
                  <span className="text-stone-800">{selectedInvoice.desc}</span>
                </div>
              )}
              <div className="flex justify-between items-center py-2">
                <span className="text-stone-500">Status</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium status-${selectedInvoice.status}`}>
                  {selectedInvoice.status}
                </span>
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <button className="flex-1 py-2.5 border border-stone-200 rounded-xl text-sm font-medium text-stone-600 hover:bg-stone-50">
                View Document
              </button>
              <button 
                onClick={() => setSelectedInvoice(null)}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white"
                style={{ background: 'linear-gradient(135deg, #292524, #44403c)' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
