<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component({
  head: {
    title: 'Discord'
  },
  validate ({ redirect }) {
    redirect(process.env.invite as string)
    return true
  }
})
export default class extends Vue {
}
</script>
