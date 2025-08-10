# Balance System Test Guide

## 🧪 **Testing the User Balance System**

This guide will help you test the complete balance system implementation to ensure it works correctly when admins approve payments.

## 📋 **Prerequisites**

1. **Database Migration Applied**
   ```bash
   cd backend
   npx prisma migrate dev --name add_user_balance_system
   ```

2. **Backend Server Running**
   ```bash
   cd backend
   npm run start:dev
   ```

3. **Frontend Server Running**
   ```bash
   cd frontend
   ng serve
   ```

## 🎯 **Test Scenarios**

### **Test 1: Payment Approval Flow**

#### **Step 1: Create a Test User**
1. Register a new user account
2. Note the user ID and username

#### **Step 2: Create a Test Order**
1. Add products to cart
2. Create an order with payment method
3. Note the order ID and total amount

#### **Step 3: Create a Test Payment**
1. Create a payment record for the order
2. Set payment status to "PENDING"
3. Note the payment ID

#### **Step 4: Approve Payment as Admin**
1. Login as admin
2. Go to admin dashboard
3. Find the payment in the payments section
4. Change payment status from "PENDING" to "COMPLETED"
5. **Expected Result**: User balance should automatically increase by the payment amount

#### **Step 5: Verify Balance Update**
1. Login as the user
2. Go to "My Account" page
3. Check the wallet balance
4. **Expected Result**: Balance should show the updated amount
5. Check balance history
6. **Expected Result**: Should show a "PAYMENT_APPROVAL" transaction

### **Test 2: Topup Approval Flow**

#### **Step 1: Submit Topup Request**
1. Login as user
2. Go to "Topup" page
3. Submit a topup request with amount
4. Note the topup ID

#### **Step 2: Approve Topup as Admin**
1. Login as admin
2. Go to admin dashboard
3. Find the topup request
4. Click "Approve"
5. **Expected Result**: User balance should automatically increase by the topup amount

#### **Step 3: Verify Balance Update**
1. Login as the user
2. Go to "My Account" page
3. Check the wallet balance
4. **Expected Result**: Balance should show the updated amount
5. Check balance history
6. **Expected Result**: Should show a "TOPUP_APPROVAL" transaction

### **Test 3: Balance History**

#### **Step 1: View Balance History**
1. Login as user
2. Go to "My Account" page
3. Scroll down to "Balance History" section
4. **Expected Result**: Should show all balance transactions

#### **Step 2: Test Pagination**
1. If there are many transactions, test pagination
2. Click "Previous" and "Next" buttons
3. **Expected Result**: Should navigate through pages correctly

### **Test 4: Admin Balance Management**

#### **Step 1: Manual Balance Update**
1. Login as admin
2. Go to admin dashboard
3. Find a user in the users section
4. Manually update their balance
5. **Expected Result**: Balance should update and create history record

#### **Step 2: View User Balance**
1. As admin, view any user's balance
2. **Expected Result**: Should show current balance and history

## 🔍 **API Testing**

### **Test Balance Endpoints**

#### **1. Get User Balance**
```bash
curl -X GET "http://localhost:3000/api/users/profile/me/balance" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### **2. Get Balance History**
```bash
curl -X GET "http://localhost:3000/api/users/profile/me/balance-history?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### **3. Update User Balance (Admin Only)**
```bash
curl -X PATCH "http://localhost:3000/api/users/USER_ID/balance" \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 100.00,
    "type": "ADD",
    "reason": "Test balance update"
  }'
```

#### **4. Approve Payment (Admin Only)**
```bash
curl -X PATCH "http://localhost:3000/api/payments/PAYMENT_ID/status" \
  -H "Authorization: Bearer ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "status": "COMPLETED"
  }'
```

## ✅ **Expected Results**

### **Database Verification**
1. **User table**: Should have `balance` column with correct values
2. **Balance History table**: Should have records for all transactions
3. **Payment table**: Should show updated status
4. **Order table**: Should show updated payment status

### **Frontend Verification**
1. **My Account page**: Should display current balance
2. **Balance History**: Should show all transactions with correct details
3. **Admin Dashboard**: Should show user balances and allow management
4. **Real-time updates**: Balance should update immediately after approval

### **Error Handling**
1. **Invalid amounts**: Should show validation errors
2. **Insufficient balance**: Should prevent deductions
3. **Unauthorized access**: Should return 401/403 errors
4. **Database errors**: Should rollback transactions

## 🐛 **Common Issues & Solutions**

### **Issue 1: Balance not updating**
- **Solution**: Check if database migration was applied
- **Solution**: Verify payment service is calling balance update
- **Solution**: Check database transaction logs

### **Issue 2: Balance history not showing**
- **Solution**: Verify balance history API endpoint
- **Solution**: Check user authentication
- **Solution**: Verify pagination parameters

### **Issue 3: Admin cannot update balance**
- **Solution**: Verify admin authentication
- **Solution**: Check admin guard implementation
- **Solution**: Verify API endpoint permissions

### **Issue 4: Frontend not reflecting changes**
- **Solution**: Check real-time balance subscription
- **Solution**: Verify API calls are successful
- **Solution**: Check browser console for errors

## 📊 **Performance Testing**

### **Load Testing**
1. **Multiple concurrent payments**: Test with 10+ simultaneous payments
2. **Large balance history**: Test with 1000+ transactions
3. **Database performance**: Monitor query execution times

### **Stress Testing**
1. **Rapid balance updates**: Test multiple updates per second
2. **Large amounts**: Test with very large balance amounts
3. **Network issues**: Test with slow/unstable connections

## 🎉 **Success Criteria**

The balance system is working correctly if:

1. ✅ **Payment approval automatically updates user balance**
2. ✅ **Topup approval automatically updates user balance**
3. ✅ **Balance history shows all transactions correctly**
4. ✅ **Admin can manually manage user balances**
5. ✅ **Real-time balance updates work in frontend**
6. ✅ **Error handling works for edge cases**
7. ✅ **Database transactions are consistent**
8. ✅ **API endpoints return correct responses**

## 📝 **Test Report Template**

```
Test Date: _______________
Tester: _______________

Test Results:
□ Payment Approval Flow: PASS/FAIL
□ Topup Approval Flow: PASS/FAIL
□ Balance History: PASS/FAIL
□ Admin Balance Management: PASS/FAIL
□ API Endpoints: PASS/FAIL
□ Error Handling: PASS/FAIL
□ Performance: PASS/FAIL

Issues Found:
1. ________________
2. ________________
3. ________________

Recommendations:
1. ________________
2. ________________
3. ________________
```

## 🚀 **Ready for Production**

Once all tests pass, the balance system is ready for production use. The system will automatically handle balance updates when admins approve payments, providing a seamless user experience.
