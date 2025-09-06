import Configs from '@/lib/config';
import { Html, Head, Body, Container, Section, Text, Link, Button, Hr } from '@react-email/components';

type ResetPasswordProps = {
  url: string,
  otp: string,
};

export default function EmailVerifyTemplate({ url, otp = "123456" }: ResetPasswordProps) {
  const validTimeToken = Configs.valid_email_verify;
  const otpStr = otp.toString().padStart(6, '0');
  const firstPart = otpStr.slice(0, 3);
  const secondPart = otpStr.slice(3, 6);

  return (
    <Html>
      <Head />
      <Body style={{ backgroundColor: '#f9f9f9', fontFamily: 'Arial, sans-serif', paddingRight: '0px', paddingLeft: '0px', color: '#333' }}>
        <Container style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
          <Section style={{ textAlign: 'center', marginBottom: '15px' }}>
            {/* Image Here */}
            <img height={30} src='https://i.postimg.cc/RFZ5cYCY/wedlyvite-landscape.png' />
            {/* <Text style={{ fontSize: '20px', fontWeight: 'bold', color: '#0070f3', marginTop: '0px' }}>{appName}</Text> */}
          </Section>

          <Section style={{ backgroundColor: '#ffffff', padding: '20px', marginBottom: '25px', borderRadius: '8px', textAlign: 'center' }}>
            <img src='https://img.freepik.com/premium-vector/envelope-with-approved-document-email-confirmation_349999-401.jpg' width={100} style={{mixBlendMode: 'multiply'}} />
            <Text style={{ fontSize: '17px', fontWeight: 'bold', margin: '0px' }}>Verify Your Email Address!</Text>
            <Text style={{ fontSize: '14px', marginTop: '0px' }}>
              Thanks for signing up! To complete your registration, please verify your email address by clicking the button below.
            </Text>

            <Button
              href={url}
              target='_blank'
              style={{
                display: 'inline-block',
                padding: '10px 15px',
                backgroundColor: '#0070f3',
                color: '#fff',
                fontSize: '14px',
                fontWeight: 'bold',
                borderRadius: '4px',
                textDecoration: 'none',
                marginTop: '10px',
                marginBottom: '10px'
              }}>
              Verify Email Address
            </Button>

            <Text style={{ marginTop: '15px', fontSize: '14px', marginBottom: '5px' }}>
              With enter your One Time Password (OTP):
            </Text>
            <Container style={{ background: '#f4f4f4', padding: '20px' }}>
              <Text style={{ fontSize: '22px', fontWeight: 'bold', letterSpacing: '10px', margin: '0px' }}>
                {firstPart}-{secondPart}
              </Text>
            </Container>

            <Text style={{ fontSize: '14px', marginTop: '20px' }}>
              If this was a mistake, just ignore this email and nothing will happen.
            </Text>

            <Hr />

            <Section style={{ textAlign: 'center' }}>
              <Text style={{ fontSize: '14px', color: '#888', marginBottom: '0px' }}>
                Alternatively, if you are having trouble clicking the "Reset Password" button, copy and paste the URL below into your web browser:
              </Text>
              <Text style={{ fontSize: '14px', color: '#0070f3', marginTop: '10px', marginBottom: '0px' }}>
                <Link href={url} style={{ textDecoration: 'none' }} target='_blank'>
                  {url}
                </Link>
              </Text>
              <Text style={{ fontSize: '13px', color: '#888', lineHeight: '19px', marginBottom: '0px', fontStyle: 'italic' }}>
                For security reasons, This verify email URL will expire in <b>{validTimeToken} minutes</b>.
              </Text>
            </Section>
          </Section>

          <Section style={{ textAlign: 'center', maxWidth: '250px' }}>
            <Text style={{ fontSize: '13px', color: '#888', marginTop: '0px', lineHeight: '19px', marginBottom: '0px' }}>
              By clicking continue, you agree to our <Link href="/terms" style={{ textDecoration: 'none', color: '#0070f3' }}>Terms of Service</Link> and our <Link href="/privacy" style={{ textDecoration: 'none', color: '#0070f3' }}>Privacy Policy</Link>.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}
