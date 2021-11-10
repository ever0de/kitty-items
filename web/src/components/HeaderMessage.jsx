import PropTypes from "prop-types"
import {useEffect, useState} from "react"
import {isAccountInitialized as isAccountInitializedTx} from "src/flow/script.is-account-initialized"
import publicConfig from "src/global/publicConfig"
import useAccountInitializer from "src/hooks/useAccountInitializer"
import useApiSaleOffers from "src/hooks/useApiSaleOffers"
import useAppContext from "src/hooks/useAppContext"
import useLogin from "src/hooks/useLogin"

const HeaderContainer = ({children}) => {
  return (
    <div className="bg-green-dark text-white text-sm sm:text-lg font-bold text-center py-4 px-2">
      {children}
    </div>
  )
}

const HEADER_MESSAGE_BUTTON_CLASSES = "font-bold underline hover:opacity-80"

export default function HeaderMessage() {
  const [isServiceAccountInitialized, setIsServiceAccountInitialized] =
    useState(null)

  const {currentUser, switchToAdminView} = useAppContext()
  const {saleOffers} = useApiSaleOffers()
  const logIn = useLogin()

  const isServiceAccountLoggedIn =
    currentUser?.addr && currentUser?.addr === publicConfig.flowAddress

  const checkIsServiceAccountInitialized = () => {
    isAccountInitializedTx(publicConfig.flowAddress).then(data => {
      setIsServiceAccountInitialized(
        data.FUSD && data.KittyItems && data.KittyItemsMarket
      )
    })
  }

  const {initializeAccount} = useAccountInitializer(
    checkIsServiceAccountInitialized
  )

  useEffect(() => {
    if (publicConfig.isDev) checkIsServiceAccountInitialized()
  }, [])

  if (publicConfig.isDev && isServiceAccountInitialized !== true) {
    if (isServiceAccountInitialized === null) return null

    return (
      <HeaderContainer>
        {isServiceAccountLoggedIn ? (
          <>
            <button
              onClick={initializeAccount}
              className={`${HEADER_MESSAGE_BUTTON_CLASSES} mr-1`}
            >
              Initialize
            </button>
            the Service Account to mint Kitty Items.
          </>
        ) : (
          <>
            {currentUser ? (
              "Log in"
            ) : (
              <button onClick={logIn} className={HEADER_MESSAGE_BUTTON_CLASSES}>
                Log in
              </button>
            )}{" "}
            to the Service Account and initialize it to get started.
          </>
        )}
      </HeaderContainer>
    )
  }

  if (saleOffers.length === 0) {
    return (
      <HeaderContainer>
        <button
          onClick={switchToAdminView}
          className="font-bold underline hover:opacity-80"
        >
          Mint some Kitty Items
        </button>
      </HeaderContainer>
    )
  }

  return (
    <HeaderContainer>
      <span className="mr-3 text-sm">💻</span>Kitty Items is a demo application
      running on the{" "}
      <a
        className="border-b border-white"
        href="https://docs.onflow.org/concepts/accessing-testnet/"
        target="_blank"
        rel="noreferrer"
      >
        Flow test network
      </a>
      .
    </HeaderContainer>
  )
}

HeaderContainer.propTypes = {
  children: PropTypes.node.isRequired,
}