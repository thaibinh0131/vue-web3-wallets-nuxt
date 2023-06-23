<script setup lang="ts">
import { computed, onMounted, nextTick, ref, watch } from "vue";
import  { ChainOption, CHAIN } from "../types";
import type { PropType } from "vue";
// import WalletConnectProvider from '@walletconnect/web3-provider';
// import FuseNetworkWalletConnectProvider from 'fuse-walletconnect-web3-provider';
import Connector from "./ConnectorComponent.vue";
import { availableConnectors } from "../constants";
import { useWallet } from "../composables/useWallet";

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },

  metamaskMobileDappLink: {
    type: String,
    default: "",
  },

  connectorIdWithoutModal: {
    type: String,
    default: "",
  },
  disabledConnectorIds: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
});

const emit = defineEmits(["update:modelValue", "error"]);
const { connectToWallet, savedConnector } = useWallet();

const windowObj = ref(window);

const isMobile = computed(() =>
  /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  )
);
const showModal = computed({
  get() {
    return props.modelValue;
  },
  set(val) {
    emit("update:modelValue", val);
  },
});
const availableConns = computed(() => {
  const data = availableConnectors
    .map((el) => {
      if (el.type === "metamask-mobile") {
        return {
          ...el,
          href: props.metamaskMobileDappLink,
        };
      } else if (el.type === "metamask") {
        return {
          ...el,
          href: "https://metamask.io/download/",
          target: "_blank",
        };
      }
      return el;
    })
    .filter((el) => !props.disabledConnectorIds.includes(el.type));
  return data;
});

onMounted(async () => {
  await nextTick();
  if (savedConnector.value) {
    connectToWallet(savedConnector.value);
  } else if (window.ethereum && window.ethereum.isMetaMask && isMobile.value) {
    connectToWallet("metamask");
  }
});

watch(
  () => props.connectorIdWithoutModal,
  (val) => {
    if (val) {
      connectToWallet(val);
    }
  }
);
</script>

<template>
  <transition name="modal" v-if="showModal">
    <div class="modal-container">
      <div class="connect-modal-mask" @click.stop="showModal = false"></div>
      <div class="connect-modal-wrapper">
        <div class="connect-modal-container">
          <div class="connect-modal-body">
            <template v-for="connector in availableConns" :key="connector.type">
              <template
                v-if="['metamask', 'metamask-mobile'].includes(connector.type)"
              >
                <template v-if="windowObj.ethereum">
                  <Connector
                    v-if="!connector.mobileOnly"
                    @connect="connectToWallet"
                    :connector="connector"
                  />
                </template>
                <template v-else>
                  <a
                    v-if="connector.href"
                    :href="connector.href"
                    :target="connector.target"
                  >
                    <Connector :connector="connector" />
                  </a>
                </template>
              </template>
              <template v-else>
                <Connector @connect="connectToWallet" :connector="connector" />
              </template>
            </template>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<style lang="css">
.connector {
  padding: 24px 16px;
  cursor: pointer;
  text-align: center;
}

.connector__img img {
  width: 45px;
  height: 45px;
}
.connector:first-child {
  border-bottom: 1px solid rgba(195, 195, 195, 0.5);
}
.connector__name {
  font-size: 24px;
  font-weight: 700;
  margin-top: 0.5rem;
  color: rgb(12, 12, 13);
}
.connector__desc {
  font-size: 16px;
  margin: 0.333em 0px;
  color: rgb(169, 169, 188);
}

@media screen and (max-width: 768px) {
  .connector__name {
    font-size: 5vw;
  }
  .connector__desc {
    font-size: 4vw;
  }
  .connector__img img {
    width: 8.5vw;
    height: 8.5vw;
  }
}

.modal-container {
  position: fixed;
  display: table;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.connect-modal-mask {
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  position: fixed;
  transition: opacity 0.3s ease;
  z-index: 1000;
}

.connect-modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.connect-modal-container {
  max-width: 500px;
  max-height: 100%;
  overflow: auto;
  margin: 20px auto;
  z-index: 1000;
  transition: all 0.3s ease;
  z-index: 99999;
  position: relative;
}

.connect-modal-body {
  margin: 20px;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  border-radius: 16px;
}

.connect-modal-body a {
  text-decoration: none;
}

/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>
