import {createLocalVue} from '@vue/test-utils'
import Vuex from 'vuex'
import Vue from 'vue'

// @ts-ignore
import {addHelpers, addVuetify, addVuex, bootstrapVueContext, compositeConfiguration, customWrapper, shallowWrapper, addI18n } from '~/tests/utils'
import {describe, beforeEach, beforeAll, afterEach, expect, it, jest} from "@jest/globals"

const localVue = createLocalVue()
localVue.use(Vuex)

const list = [
    {
        id: 2,
        name: 'SAP_MMT_FL_EKKN2',
        tblExtProperty: {tableLogicalName: '購買伝票管理テーブル2', logicalName: 'B'},
        extProperty: {tableLogicalName: '購買伝票管理テーブル2', logicalName: 'B'},
        location: {name: 'データカタログシステム2'},
        owner: {name: 'システム部門2'},
        tags: [{name: '#tag2'}],
        modifyDate: '2021-05-25 15:30:00',

    },
    {
        id: 1,
        name: 'SAP_MMT_FL_EKKN',
        tblExtProperty: {tableLogicalName: '購買伝票管理テーブル', logicalName: 'A'},
        extProperty: {tableLogicalName: '購買伝票管理テーブル', logicalName: 'A'},
        location: {name: 'データカタログシステム'},
        owner: {name: 'システム部門'},
        tags: [{name: '#tag1'}],
        modifyDate: '2021-05-12 20:00:00',

    },
]
jest.mock('vuex-composition-helpers', () => {
    const resultModule = {
        useGetters: (params: string[]) => ({
            list
        })
    }
    const createNamespacedHelpers = (moduleName: string) => resultModule

    return { createNamespacedHelpers }
})

// @ts-ignore
import resultModule from '~/store/result/results'

// @ts-ignore
import List from '@/components/result/List'



describe('List.vue', () => {
    let vueContext:any = null
    let wrapper:any = null

    beforeEach(() => {
        // @ts-ignore
        vueContext = bootstrapVueContext(
            compositeConfiguration(addVuex, addVuetify, addHelpers(), addI18n())
        )
        wrapper = customWrapper(List, vueContext)

    })

    afterEach(() => {
        vueContext.teardownVueContext()
        jest.restoreAllMocks()
    })

    describe('Data Table', () => {
        beforeEach(() => {
            wrapper.setData({
                resultList: list
            })
        })
        it('Test case: when click to "データ名" column', async () => {
            const dataTable = wrapper.find('#result-table')
            expect(dataTable.exists()).toBe(true)
            const buttonSort = dataTable.find('thead tr th:nth-child(1) .v-btn');
            expect(buttonSort.exists()).toBe(true)
            const colDataWrapperBefores = wrapper.findAll('.v-data-table__wrapper tbody tr td:nth-child(1)').wrappers
            expect(colDataWrapperBefores).not.toBeNull()
            let datas = colDataWrapperBefores.map((item: any) => item.element.textContent.trim())
            expect(datas.length).toBe(2)
            expect(datas[0]).toEqual('SAP_MMT_FL_EKKN')
            buttonSort.element.click()
            await wrapper.vm.$nextTick();
            const colDataWrapperAfters = wrapper.findAll('.v-data-table__wrapper tbody tr td:nth-child(1)').wrappers
            datas = colDataWrapperAfters.map((item: any) => item.element.textContent.trim())
            expect(datas.length).toBe(2)
            expect(datas[0]).toEqual('SAP_MMT_FL_EKKN2')

        })
        it('Test case: when click to "論理名" column', async () => {
            const dataTable = wrapper.find('#result-table')
            expect(dataTable.exists()).toBe(true)
            const buttonSort = dataTable.find('thead tr th:nth-child(2) .v-btn');
            expect(buttonSort.exists()).toBe(true)
            const colDataWrapperBefores = wrapper.findAll('.v-data-table__wrapper tbody tr td:nth-child(2)').wrappers
            expect(colDataWrapperBefores).not.toBeNull()
            let datas = colDataWrapperBefores.map((item: any) => item.element.textContent.trim())
            expect(datas.length).toBe(2)
            expect(datas[0]).toEqual('A')
            buttonSort.element.click()
            await wrapper.vm.$nextTick();
            buttonSort.element.click()
            await wrapper.vm.$nextTick();
            const colDataWrapperAfters = wrapper.findAll('.v-data-table__wrapper tbody tr td:nth-child(2)').wrappers
            datas = colDataWrapperAfters.map((item: any) => item.element.textContent.trim())
            expect(datas.length).toBe(2)
            expect(datas[0]).toEqual('B')

        })
        it('Test case: when click to "ロケーション" column', async () => {
            const dataTable = wrapper.find('#result-table')
            expect(dataTable.exists()).toBe(true)
            const buttonSort = dataTable.find('thead tr th:nth-child(3) .v-btn');
            expect(buttonSort.exists()).toBe(true)
            const colDataWrapperBefores = wrapper.findAll('.v-data-table__wrapper tbody tr td:nth-child(3)').wrappers
            expect(colDataWrapperBefores).not.toBeNull()
            let datas = colDataWrapperBefores.map((item: any) => item.element.textContent.trim())
            expect(datas.length).toBe(2)
            expect(datas[0]).toEqual('データカタログシステム')
            buttonSort.element.click()
            await wrapper.vm.$nextTick();
            buttonSort.element.click()
            await wrapper.vm.$nextTick();
            const colDataWrapperAfters = wrapper.findAll('.v-data-table__wrapper tbody tr td:nth-child(3)').wrappers
            datas = colDataWrapperAfters.map((item: any) => item.element.textContent.trim())
            expect(datas.length).toBe(2)
            expect(datas[0]).toEqual('データカタログシステム2')

        })

        it('Test case: when click to "データオーナー" column', async () => {
            const dataTable = wrapper.find('#result-table')
            expect(dataTable.exists()).toBe(true)
            const buttonSort = dataTable.find('thead tr th:nth-child(4) .v-btn');
            expect(buttonSort.exists()).toBe(true)
            const colDataWrapperBefores = wrapper.findAll('.v-data-table__wrapper tbody tr td:nth-child(4)').wrappers
            expect(colDataWrapperBefores).not.toBeNull()
            let datas = colDataWrapperBefores.map((item: any) => item.element.textContent.trim())
            expect(datas.length).toBe(2)
            expect(datas[0]).toEqual('システム部門')
            buttonSort.element.click()
            await wrapper.vm.$nextTick();
            buttonSort.element.click()
            await wrapper.vm.$nextTick();
            const colDataWrapperAfters = wrapper.findAll('.v-data-table__wrapper tbody tr td:nth-child(4)').wrappers
            datas = colDataWrapperAfters.map((item: any) => item.element.textContent.trim())
            expect(datas.length).toBe(2)
            expect(datas[0]).toEqual('システム部門2')

        })

        it('Test case: when click to "タグ" column', async () => {
            const dataTable = wrapper.find('#result-table')
            expect(dataTable.exists()).toBe(true)
            const buttonSort = dataTable.find('thead tr th:nth-child(5) .v-btn');
            expect(buttonSort.exists()).toBe(true)
            const colDataWrapperBefores = wrapper.findAll('.v-data-table__wrapper tbody tr td:nth-child(5)').wrappers
            expect(colDataWrapperBefores).not.toBeNull()
            let datas = colDataWrapperBefores.map((item: any) => item.element.textContent.trim())
            expect(datas.length).toBe(2)
            expect(datas[0]).toContain('#tag1')
            buttonSort.element.click()
            await wrapper.vm.$nextTick();
            buttonSort.element.click()
            await wrapper.vm.$nextTick();
            const colDataWrapperAfters = wrapper.findAll('.v-data-table__wrapper tbody tr td:nth-child(5)').wrappers
            datas = colDataWrapperAfters.map((item: any) => item.element.textContent.trim())
            expect(datas.length).toBe(2)
            expect(datas[0]).toContain('#tag2')

        })

        it('Test case: when click to "更新日時" column', async () => {
            const dataTable = wrapper.find('#result-table')
            expect(dataTable.exists()).toBe(true)
            const buttonSort = dataTable.find('thead tr th:nth-child(6) .v-btn');
            expect(buttonSort.exists()).toBe(true)
            const colDataWrapperBefores = wrapper.findAll('.v-data-table__wrapper tbody tr td:nth-child(6)').wrappers
            expect(colDataWrapperBefores).not.toBeNull()
            let datas = colDataWrapperBefores.map((item: any) => item.element.textContent.trim())
            expect(datas.length).toBe(2)
            expect(datas[0]).toEqual('2021/05/12 20:00')
            buttonSort.element.click()
            await wrapper.vm.$nextTick();
            buttonSort.element.click()
            await wrapper.vm.$nextTick();
            const colDataWrapperAfters = wrapper.findAll('.v-data-table__wrapper tbody tr td:nth-child(6)').wrappers
            datas = colDataWrapperAfters.map((item: any) => item.element.textContent.trim())
            expect(datas.length).toBe(2)
            expect(datas[0]).toContain('2021/05/25 15:30')

        })
    })

})
