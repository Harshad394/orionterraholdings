import fs from 'fs';
import path from 'path';

// Parse .env.local manually if it exists so CLI seeding receives all environment variables
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, 'utf-8');
  for (const line of envConfig.split('\n')) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const idx = trimmed.indexOf('=');
      if (idx > 0) {
        const key = trimmed.substring(0, idx).trim();
        const value = trimmed.substring(idx + 1).trim();
        if (!process.env[key]) {
          process.env[key] = value;
        }
      }
    }
  }
}

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import connectToDatabase from '../src/lib/db/mongodb';
import Property from '../src/models/Property';
import SellerSubmission from '../src/models/SellerSubmission';
import Inquiry from '../src/models/Inquiry';
import Admin from '../src/models/Admin';
import { MOCK_PROPERTIES } from '../src/data/mockProperties';

async function seedDatabase() {
  console.log('🌱 Starting Orion Terra Database Seeding...');

  try {
    console.log(`Connecting to MongoDB at ${process.env.MONGODB_URI ? 'configured URI' : 'default localhost'}...`);
    await connectToDatabase();

    // 1. Seed Admin Account
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@orionterra.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'adminpassword123';

    await Admin.deleteMany({});
    const passwordHash = await bcrypt.hash(adminPassword, 10);
    const admin = await Admin.create({
      email: adminEmail.toLowerCase(),
      passwordHash,
    });
    console.log(`✅ Admin account created: ${admin.email}`);

    // 2. Seed Demo Properties
    await Property.deleteMany({});

    const createdProperties = [];
    for (const p of MOCK_PROPERTIES) {
      const propDoc = await Property.create({
        title: p.title,
        slug: p.slug,
        propertyId: p.propertyId,
        description: p.description,
        location: {
          address: p.location.address,
          city: p.location.city,
          state: p.location.state,
          country: p.location.country || 'India',
          latitude: p.location.latitude,
          longitude: p.location.longitude,
        },
        landArea: p.landArea,
        landAreaUnit: p.landAreaUnit,
        propertyType: p.propertyType,
        opportunityType: p.opportunityType,
        price: p.price,
        priceVisibility: p.priceVisibility,
        images: p.images,
        featured: p.featured,
        status: p.status,
      });
      createdProperties.push(propDoc);
    }

    // Add 1 Draft property for testing status isolation
    const draftProp = await Property.create({
      title: 'Unpublished Demo Draft Plot - Panvel',
      slug: 'unpublished-demo-draft-panvel',
      propertyId: 'OT-MH-009-DRAFT',
      description: 'Draft property under review. Should never be accessible publicly.',
      location: {
        address: 'Sector 10 Karnala Belt',
        city: 'Navi Mumbai',
        state: 'Maharashtra',
        country: 'India',
      },
      landArea: 15000,
      landAreaUnit: 'sq.ft',
      propertyType: 'Residential',
      opportunityType: 'Redevelopment',
      price: 150000000,
      priceVisibility: 'CONTACT',
      images: ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80'],
      featured: false,
      status: 'DRAFT',
    });
    console.log(`✅ Seeded ${createdProperties.length + 1} Properties (${createdProperties.length} Published, 1 Draft).`);

    // 3. Seed Demo Seller Submissions
    await SellerSubmission.deleteMany({});
    const sub1 = await SellerSubmission.create({
      sellerName: 'Sanjay Deshmukh',
      phone: '+91 98200 11223',
      email: 'sanjay.deshmukh@example.com',
      company: 'Deshmukh Land Holdings',
      propertyLocation: 'Survey No. 45, Highway Junction',
      city: 'Thane',
      state: 'Maharashtra',
      landArea: 35000,
      landAreaUnit: 'sq.ft',
      propertyType: 'Commercial',
      opportunityType: 'Joint Venture',
      expectedPrice: 280000000,
      description: 'Prime commercial road touch land available for JV tower development.',
      documentsAvailable: 'Yes',
      status: 'PENDING',
    });

    const sub2 = await SellerSubmission.create({
      sellerName: 'Vikram Joshi',
      phone: '+91 98920 33445',
      email: 'vjoshi@example.com',
      propertyLocation: 'Plot 12, MIDC Belt',
      city: 'Navi Mumbai',
      state: 'Maharashtra',
      landArea: 5,
      landAreaUnit: 'acre',
      propertyType: 'Industrial',
      opportunityType: 'Direct Sale',
      expectedPrice: 420000000,
      description: 'Industrial zone plot near logistics corridor.',
      documentsAvailable: 'Yes',
      status: 'APPROVED',
    });
    console.log('✅ Seeded 2 Demo Seller Submissions (1 Pending, 1 Approved).');

    // 4. Seed Demo Buyer Inquiries
    await Inquiry.deleteMany({});
    if (createdProperties.length > 0) {
      await Inquiry.create({
        propertyId: createdProperties[0]._id,
        name: 'Amitabh Roy',
        phone: '+91 97110 55667',
        email: 'aroy@example.com',
        message: `Interested in property ${createdProperties[0].propertyId}. Looking for site visit scheduling this weekend.`,
        status: 'NEW',
      });
      await Inquiry.create({
        propertyId: createdProperties[1]._id,
        name: 'Kavita Sundaram',
        phone: '+91 98400 99887',
        email: 'kavita@example.com',
        message: `Requesting preliminary document verification check for ${createdProperties[1].propertyId}.`,
        status: 'CONTACTED',
      });
      console.log('✅ Seeded 2 Demo Buyer Inquiries.');
    }

    console.log('🎉 Database Seeding Successfully Completed!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error Seeding Database:', err);
    process.exit(1);
  }
}

seedDatabase();
