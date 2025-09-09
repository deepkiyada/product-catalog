#!/usr/bin/env node

/**
 * Migration script to transfer existing products from JSON file to Supabase
 * Run this script once after setting up Supabase to migrate existing data
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  console.error('Please ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function migrateProducts() {
  try {
    console.log('🚀 Starting migration from JSON to Supabase...');

    // Read existing products from JSON file
    const jsonFilePath = path.join(process.cwd(), 'data', 'products.json');
    
    if (!fs.existsSync(jsonFilePath)) {
      console.log('📄 No existing products.json file found. Nothing to migrate.');
      return;
    }

    const jsonData = fs.readFileSync(jsonFilePath, 'utf-8');
    const products = JSON.parse(jsonData);

    if (!Array.isArray(products) || products.length === 0) {
      console.log('📄 No products found in JSON file. Nothing to migrate.');
      return;
    }

    console.log(`📊 Found ${products.length} products to migrate`);

    // Check if products already exist in Supabase
    const { data: existingProducts, error: checkError } = await supabase
      .from('products')
      .select('id')
      .limit(1);

    if (checkError) {
      console.error('❌ Error checking existing products:', checkError.message);
      return;
    }

    if (existingProducts && existingProducts.length > 0) {
      console.log('⚠️  Products already exist in Supabase. Skipping migration.');
      console.log('   If you want to force migration, clear the products table first.');
      return;
    }

    // Transform products for Supabase
    const transformedProducts = products.map(product => ({
      name: product.name,
      price: product.price,
      original_price: product.originalPrice || null,
      category: product.category,
      image: product.image,
      images: product.images || null,
      featured: product.featured || false,
      tags: product.tags || null,
    }));

    // Insert products into Supabase
    console.log('💾 Inserting products into Supabase...');
    
    const { data: insertedProducts, error: insertError } = await supabase
      .from('products')
      .insert(transformedProducts)
      .select();

    if (insertError) {
      console.error('❌ Error inserting products:', insertError.message);
      return;
    }

    console.log(`✅ Successfully migrated ${insertedProducts.length} products to Supabase!`);
    
    // Create backup of original JSON file
    const backupPath = path.join(process.cwd(), 'data', `products-backup-${Date.now()}.json`);
    fs.copyFileSync(jsonFilePath, backupPath);
    console.log(`📦 Created backup of original file: ${backupPath}`);

    console.log('🎉 Migration completed successfully!');
    console.log('');
    console.log('Next steps:');
    console.log('1. Test your application to ensure everything works');
    console.log('2. Deploy your updated application');
    console.log('3. Remove the old products.json file when you\'re confident everything works');

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
}

// Run migration
migrateProducts();
