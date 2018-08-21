
import Vue from 'vue';
import Alert from './main.vue';

const AlertConstructor = Vue.extend(Alert);

let id = 0;

function alert(message = '', cb = function () {}) {
  if (Vue.prototype.$isServer) return;
  
  let instance = new AlertConstructor({
    data: {
      message
    }
  });

  instance.id = 'alert' + (id++);
  instance.vm = instance.$mount();
  instance.vm.$once('ok', cb);
  document.body.appendChild(instance.vm.$el);

  instance.vm.visible = true;
  
  instance.vm.$nextTick(() => {
    instance.vm.$refs.confirmBtn.focus();
  });

  return instance.vm;
}

alert.install = (Vue) => {
  Vue.prototype.$alert = alert;
}

export default alert;
