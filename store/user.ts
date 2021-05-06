import { Module, VuexModule, VuexMutation } from 'nuxt-property-decorator'
import { User } from '~/models/users/user'

@Module({
  name: 'user',
  namespaced: true,
  preserveState: true,
  stateFactory: true
})
export default class UserModule extends VuexModule {
  private _data: User | null = null

  get data () {
    return this._data
  }

  @VuexMutation
  setData (user: User | null) {
    this._data = user
  }
}
