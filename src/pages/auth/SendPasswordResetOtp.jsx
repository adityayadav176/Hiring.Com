import React from 'react'
import AuthLayout from '../../components/auth/AuthLayout'
import SendPasswordResetOtpForm from '../../components/auth/SendPasswordResetOtpForm';

function SendPasswordResetOtp() {
  return (
    <AuthLayout>
        <SendPasswordResetOtpForm/>
    </AuthLayout>
  )
}

export default SendPasswordResetOtp
