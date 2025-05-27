
import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Shield } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t">
      <div className="container px-4 py-8 mx-auto">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand Section with Logo */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-blue-500 rounded-lg flex items-center justify-center">
                <div className="w-5 h-5 bg-white rounded-sm flex items-center justify-center">
                  <span className="text-teal-600 font-bold text-xs">S4</span>
                </div>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
                Shop4ll
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Your trusted marketplace where individuals can create their own stores and sell products with confidence.
            </p>
            <div className="flex items-center gap-2 text-sm text-green-600">
              <Shield className="w-4 h-4" />
              <span className="font-medium">Verified & Secure Platform</span>
            </div>
          </div>
          
          <div>
            <h3 className="mb-3 text-sm font-semibold">Shop</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/marketplace" className="text-muted-foreground hover:text-foreground">Marketplace</Link></li>
              <li><Link to="/categories" className="text-muted-foreground hover:text-foreground">Categories</Link></li>
              <li><Link to="/deals" className="text-muted-foreground hover:text-foreground">Deals</Link></li>
              <li><Link to="/new-arrivals" className="text-muted-foreground hover:text-foreground">New Arrivals</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="mb-3 text-sm font-semibold">Sell</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/start-selling" className="text-muted-foreground hover:text-foreground">Start Selling</Link></li>
              <li><Link to="/seller/dashboard" className="text-muted-foreground hover:text-foreground">Seller Dashboard</Link></li>
              <li><Link to="/seller-guides" className="text-muted-foreground hover:text-foreground">Seller Guides</Link></li>
            </ul>
          </div>
          
          {/* Support & Contact Section */}
          <div>
            <h3 className="mb-3 text-sm font-semibold">Support & Contact</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="mailto:mainshop@shop4ll.co.za" className="flex items-center gap-2 text-muted-foreground hover:text-teal-600 transition-colors">
                  <Mail className="w-4 h-4" />
                  mainshop@shop4ll.co.za
                </a>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                South Africa
              </li>
              <li><Link to="/terms" className="text-muted-foreground hover:text-foreground">Terms of Service</Link></li>
              <li><Link to="/privacy" className="text-muted-foreground hover:text-foreground">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 mt-8 border-t">
          <div className="flex items-center justify-between flex-col md:flex-row gap-4">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <p className="text-sm text-muted-foreground">
                &copy; {new Date().getFullYear()} Shop4ll. All rights reserved.
              </p>
              <div className="flex items-center gap-2 text-sm text-green-600">
                <Shield className="w-4 h-4" />
                <span>Trusted by thousands of South African businesses</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="#" className="text-muted-foreground hover:text-foreground">
                <span className="sr-only">Facebook</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
              </Link>
              <Link to="#" className="text-muted-foreground hover:text-foreground">
                <span className="sr-only">Twitter</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" /></svg>
              </Link>
              <Link to="#" className="text-muted-foreground hover:text-foreground">
                <span className="sr-only">Instagram</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
