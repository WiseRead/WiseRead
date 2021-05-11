<template>
  <!--
    Use it like this:
      <RadioGroup
        :options="['option1', 'option2' 'option3']"
        style="--indicator-color: black; --labels-gap: 2rem;"
      />

    Or with 'radio-stretch':
      <RadioGroup
        class="radio-stretch"
        :options="['option1', 'option2' 'option3']"
      />

    --------------------------------------------------
    Inspired by: https://codepen.io/woranov/pen/NRqLWK/
    --------------------------------------------------
   -->
  <div ref="radioGroup" class="horizontal-radio-group">
    <div class="radio-list-grid">
      <label v-for="(option, index) in options" :key="index" :class="{picked: picked == index}">{{ option }}
        <input v-model="picked" type="radio" :name="uid" :value="index" @change="onChange($event)" />
      </label>
    </div>
    <div class="slider"><div class="indicator"></div></div>
  </div>
</template>

<script>
let uid = 0 // See https://github.com/vuejs/vue/issues/5886#issuecomment-308607131

export default {
  props: {
    options: {
      required: true,
      type: Array
    },

    // for v-model.
    // See https://www.digitalocean.com/community/tutorials/how-to-add-v-model-support-to-custom-vue-js-components
    value: {
      required: false,
      type: [String, Number],
      default: ''
    }
  },

  data () {
    uid += 1
    return {
      uid: `radio-group-${uid}`, // unique group name
      picked: 0,
    }
  },

  watch: {
    options: function (val, oldVal) {
      // Update css in the beginning and in every options.length change:
      this.css_setNumberOfLabels(val.length)
      if (this.picked >= val.length) {
        this.css_setCurrentLabel(val.length - 1)
      }
    },
    value: {
      handler (val, oldVal) {
        this.setCurrentLabelOrEmit(val)
      }
    },
  },

  mounted () {
    this.$nextTick(function () { // Code that will run only after the entire view has been rendered
      this.css_setNumberOfLabels(this.options.length)
      this.setCurrentLabelOrEmit(this.value)
    })
  },

  methods: {
    onChange (event) {
      const labelNumber = event.target.value
      this.css_setCurrentLabel(labelNumber)
      this.$emit('input', this.getOptionIdByLabelNumber(labelNumber))
    },

    getOptionIdByLabelNumber (labelNumber) {
      return this.options[parseInt(labelNumber)]
    },

    getLabelNumberByOptionId (optionId) {
      return this.options.indexOf(optionId)
    },

    css_setNumberOfLabels (newNumber) {
      if (newNumber >= 1) {
        // @ts-ignore
        this.$refs.radioGroup.style.setProperty('--number-of-labels', newNumber)
      }
    },

    css_setCurrentLabel (curLabelNumber) {
      if (curLabelNumber >= 0) {
        // @ts-ignore
        this.$refs.radioGroup.style.setProperty('--current-label', curLabelNumber)
      }
    },

    setCurrentLabelOrEmit (optionId) {
      const labelNumber = this.getLabelNumberByOptionId(optionId)

      if (labelNumber >= 0) {
        this.picked = labelNumber
        this.css_setCurrentLabel(labelNumber)
      }
      else {
        this.$emit('input', this.getOptionIdByLabelNumber(0))
      }
    },
  }
}
</script>

<style lang="scss">
.horizontal-radio-group {
  /* colors */
  --label-color: unset;
  --label-color-checked: unset;
  --label-background-color: transparent;
  --indicator-color: rgb(167, 167, 167);

  /* tabs */
  --number-of-labels: 2;
  --current-label: 0;
  --labels-gap: 3.6rem;
  --labels-padding-y: 0.6rem;
  --labels-padding-x: 0;

  /* indicator */
  --indicator-width: 100%; // 100% is the full label size
  --indicator-height: 4px;
  --indicator-border-radius: 20px;
  --indicator-move-time: 0.25s;

  /* group border */
  --group-border-color: var(--indicator-color);
  --group-border-bottom-width: 0;

  display: inline-block;

  &.radio-stretch {
    // make the labels as big as possible
    display: block;
  }

  .radio-list-grid {
    display: grid;
    grid-gap: var(--labels-gap);
    gap: var(--labels-gap);
    grid-template-columns: repeat(var(--number-of-labels), minmax(0, 1fr));
    border-color: var(--group-border-color);
    border-bottom-width: var(--group-border-bottom-width);

    label {
      // center
      display: flex;
      justify-content: center;
      align-items: center;

      transition: all 0.2s ease-in-out;
      color: var(--label-color);
      background-color: var(--label-background-color);
      padding: var(--labels-padding-y) var(--labels-padding-x);
      -webkit-touch-callout: none;
      cursor: pointer;
      user-select: none;

      // truncate:
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;

      &.picked,
      &:hover,
      &:focus,
      &:active,
      &:checked {
        outline: 0;
        color: var(--label-color-checked);

        svg {
          fill: var(--label-color-checked);
        }
      }
    }

    input {
      display: none;
    }
  }

  .slider {
    position: relative;
    width: calc((100% - (var(--number-of-labels) - 1) * var(--labels-gap)) / var(--number-of-labels));
    transition: all var(--indicator-move-time) cubic-bezier(0.38, 0.8, 0.32, 1.07);
    transform: translateX(calc(100% * var(--current-label) + var(--labels-gap) * var(--current-label)));

    .indicator {
      position: relative;
      width: var(--indicator-width);
      max-width: 100%;
      margin: 0 auto;
      height: var(--indicator-height);
      background: var(--indicator-color);
      border-radius: var(--indicator-border-radius);
    }
  }
}

</style>
