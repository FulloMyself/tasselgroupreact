// controllers/paymentController.js
exports.initiatePayment = async (req, res) => {
  const start = Date.now();
  const requestId = `payfast_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  console.log(`[PAYFAST][${requestId}] Payment initiation started`, {
    timestamp: new Date().toISOString(),
    itemsCount: req.body?.items?.length || 0,
    totalAmount: req.body?.totalAmount,
    userId: req.user?._id
  });

  try {
    const orderData = req.body;
    
    // Validate required fields
    if (!orderData || !orderData.items || orderData.items.length === 0) {
      return res.status(400).json({ 
        success: false,
        error: 'Missing or invalid order data'
      });
    }

    if (!orderData.totalAmount || orderData.totalAmount <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid total amount'
      });
    }

    // Generate unique payment reference
    const paymentReference = `TASSEL_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Use sandbox credentials for testing
    const payfastData = {
      merchant_id: process.env.PAYFAST_MERCHANT_ID || '10000100',
      merchant_key: process.env.PAYFAST_MERCHANT_KEY || '46f0cd694581a',
      return_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/payment/success?reference=${paymentReference}`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/payment/cancelled`,
      notify_url: `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/payment/notify`,
      m_payment_id: paymentReference,
      amount: orderData.totalAmount.toFixed(2),
      item_name: `Tassel Group Order - ${orderData.items.length} item(s)`,
      item_description: `Order containing: ${orderData.items.map(item => `${item.quantity}x ${item.name}`).join(', ')}`,
      email_address: req.user?.email || 'customer@example.com',
      name_first: req.user?.name?.split(' ')[0] || 'Customer',
      name_last: req.user?.name?.split(' ').slice(1).join(' ') || 'Test',
    };

    // Remove any empty values that might cause issues
    Object.keys(payfastData).forEach(key => {
      if (payfastData[key] === '' || payfastData[key] === null || payfastData[key] === undefined) {
        delete payfastData[key];
      }
    });

    console.log(`[PAYFAST][${requestId}] Prepared Payfast data:`, {
      amount: payfastData.amount,
      item_name: payfastData.item_name,
      merchant_id: payfastData.merchant_id,
      reference: paymentReference
    });

    // Use sandbox for testing
    const payfastUrl = 'https://sandbox.payfast.co.za/eng/process';

    // Create temporary order in database (if you have Order model)
    try {
      // If you have an Order model, create the order
      const tempOrder = await Order.create({
        ...orderData,
        paymentReference,
        paymentMethod: 'payfast',
        status: 'pending',
        paymentStatus: 'initiated',
        user: req.user?._id,
        createdAt: new Date()
      });
      console.log(`[PAYFAST][${requestId}] Temporary order created:`, tempOrder._id);
    } catch (dbError) {
      console.log(`[PAYFAST][${requestId}] Order creation skipped or failed:`, dbError.message);
      // Continue even if order creation fails for testing
    }

    const processingTime = Date.now() - start;
    console.log(`[PAYFAST][${requestId}] Payment initiation successful in ${processingTime}ms`);

    // Return the response in the expected format
    res.status(200).json({
      success: true,
      payfastUrl: payfastUrl,
      payfastData: payfastData, // This is crucial for the frontend
      paymentReference: paymentReference,
      message: 'Payment initiated successfully. Redirect to Payfast.'
    });

  } catch (error) {
    const processingTime = Date.now() - start;
    console.error(`[PAYFAST][${requestId}] Payment initiation failed after ${processingTime}ms:`, error);

    res.status(500).json({
      success: false,
      error: 'Payment initiation failed',
      message: error.message,
      details: process.env.NODE_ENV === 'production' ? 'Internal server error' : error.stack
    });
  }
};