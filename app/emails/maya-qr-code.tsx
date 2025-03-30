import { Html } from '@react-email/html'
import { Text } from '@react-email/text'
import { Section } from '@react-email/section'
import { Container } from '@react-email/container'

interface MayaQRCodeEmailProps {
  activationCode: string
  orderId: string
}

export function MayaQRCode({ activationCode, orderId }: MayaQRCodeEmailProps) {
  return (
    <Html>
      <Section style={main}>
        <Container style={container}>
          <Text style={heading}>Your eSIM is Ready!</Text>
          <Text style={paragraph}>
            Thank you for your purchase. Here's your activation code for order #{orderId.slice(0, 8)}:
          </Text>
          
          <Text style={code}>{activationCode}</Text>
          
          <Text style={paragraph}>
            Scan the attached QR code with your device to activate your eSIM, 
            or enter the code above manually.
          </Text>
          
          <Text style={paragraph}>
            If you have any issues, please contact support@soravio.com
          </Text>
        </Container>
      </Section>
    </Html>
  )
}

const main = {
  backgroundColor: '#ffffff',
  fontFamily: 'Arial, sans-serif',
}

const container = {
  margin: '0 auto',
  padding: '20px',
  maxWidth: '600px',
  border: '1px solid #eaeaea',
  borderRadius: '5px',
}

const heading = {
  fontSize: '24px',
  fontWeight: 'bold',
  color: '#000000',
  marginBottom: '20px',
}

const paragraph = {
  fontSize: '16px',
  lineHeight: '1.5',
  color: '#333333',
  margin: '10px 0',
}

const code = {
  display: 'inline-block',
  padding: '10px 20px',
  backgroundColor: '#f5f5f5',
  borderRadius: '4px',
  fontFamily: 'monospace',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '15px 0',
}
