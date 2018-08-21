<template>
  <div class="cb-alert-wrapper">
    <div class="cb-alert-mask" v-show="visible"></div>
    <transition name="alert-scale">
      <div class="cb-alert" v-show="visible">
        <div class="cb-alert-content" v-html="message"></div>
        <button class="cb-alert-btn" @click="ok" ref="confirmBtn">确&nbsp;认</button>
      </div>
    </transition>
  </div>
</template>

<style>
.cb-alert-wrapper {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 10000;
}

.cb-alert-mask {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .25);
}

.cb-alert {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  border-radius: 5px;
}

.cb-alert-content {
  padding: 30px 20px;
  min-width: 240px;
  color: #f60;
  font-size: 14px;
  text-align: center;

  & > a {
    margin: 0 2px;
    color: inherit;

    text-decoration: underline;
  }
}

.cb-alert-btn {
  display: block;
  width: 100%;
  height: 40px;
  font-size: 14px;
  background-color: #f5f5f5;
  color: #666;
  border: none;
  border-top: 1px solid #ebebeb;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  outline: none;
}

.alert-scale-enter-active {
  animation: scale-in .5s cubic-bezier(0.4, 0, 0, 1.5);
}

.alert-scale-leave-active {
  animation: scale-out .8s cubic-bezier(0.4, 0, 0, 1.5);
}

@keyframes scale-in {
  0% {
    transform: translate(-50%, -50%) scale(0);
    opacity: 0;
  }

  100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
}

@keyframes scale-out {
  0% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }

  100% {
    transform: translate(-50%, -50%) scale(1.5);
    opacity: 0;
  }
}
</style>

<script>
  const animationEnd = ((function() {
    let el = document.createElement('div');

    if (typeof el.style.animation !== 'undefined') {
      return 'animationend';
    } else if (el.style.webkitAnimation) {
      return 'webkitAnimationEnd';
    } else {
      return null;
    }
  })());

  export default {
    data() {
      return {
        message: '',
        visible: false
      };
    },
    methods: {
      destroy() {
        if (animationEnd) {
          this.$el.removeEventListener(animationEnd, this.destroy, false);
        }
        this.$destroy();
        this.$el.parentNode.removeChild(this.$el);
      },
      ok() {
        this.$emit('ok');
        this.$refs.confirmBtn.blur();
        this.visible = false;
        if (animationEnd) {
          this.$el.addEventListener(animationEnd, this.destroy, false);
        } else {
          this.destroy();
        }
      }
    }
  }
</script>