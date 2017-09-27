<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="row">
          <div class="modal-header small-24 medium-12 small-centered columns">
            <div class="card">
              <div class="card-divider">
                <slot name="header"><h3><i class="fi-skull"></i> {{ title }}</h3></slot>
              </div>
              <div class="card-section">
                <div class="modal-body">
                  {{ message }}
                </div>

                <div class="modal-footer text-right">
                  <slot name="footer">
                    <button class="modal-default-button" @click="$emit('close')">OK</button>
                  </slot>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
<<script>
export default {
  name: 'Modal',
  data() {
    return {
      showModal: false,
    };
  },
  props: {
    message: {
      require: true,
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: 'Oops! Philly, we\'ve had a problem.',
    },
  },
};
</script>
<<style>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .5);
  display: table;
  transition: opacity .3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}
.modal-header{
  padding: 1px 0;
}
.modal-body{
  padding: 1px 0;
}
.modal-footer{
  padding: 1px 0;
}

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

