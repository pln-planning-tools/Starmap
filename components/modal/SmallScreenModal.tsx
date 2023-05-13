import {
  Box, Center,
  Flex, Link, Modal, ModalBody,
  ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text
} from '@chakra-ui/react'
import useCheckMobileScreen from '../../hooks/useCheckSmallScreen'
import SvgStarMapsLogo from '../icons/svgr/StarMapsLogo'
import SvgDesktopIcon from '../icons/svgr/SvgDesktopIcon'
import SvgRotateScreenIcon from '../icons/svgr/SvgRotateScreenIcon'
import styles from './SmallScreenModal.module.css'

export default function SmallScreenModal () {
  const [isSmallScreen, setAcknowledgeSmallScreen] = useCheckMobileScreen()
  const closeHandler = () => setAcknowledgeSmallScreen(true)
  return (
    <Modal size='xs' isOpen={isSmallScreen} onClose={closeHandler} isCentered={true}>
      <ModalOverlay />
      <ModalContent background='#27292C' color='#D7D7D7' borderTop='#F39106 2px solid' lineHeight={6} borderRadius={0}>
        <ModalHeader alignSelf='center' mt={2}>
          <SvgStarMapsLogo width={45} height={45}></SvgStarMapsLogo>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody p={4}>
          <Center textAlign='center'>
            <Text as='p' className={styles.modalHeader} alignSelf='center' pb={8}>
              Starmap is not optimized for mobile viewing.
            </Text>
          </Center>
          <Flex>
            <Box>
              <SvgDesktopIcon width={60}></SvgDesktopIcon>
            </Box>
            <Text as='p' className={styles.iconsText}>
              Please access Starmap using a different device.
            </Text>
          </Flex>
          <Flex>
            <Box>
              <SvgRotateScreenIcon width={60}></SvgRotateScreenIcon>
            </Box>
            <Text as='p' className={styles.iconsText}>
            If you still want to try viewing Starmap in mobile, rotate your phone horizontally for the best experience.
            </Text>
          </Flex>
        </ModalBody>
        <ModalFooter alignSelf='center' mb={6}>
          <Link onClick={closeHandler} color='#1FA5FF' fontSize='18pt'>Ok, got it</Link>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
