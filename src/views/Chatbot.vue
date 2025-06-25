<template>
    <div class="min-h-screen flex flex-col relative" :style="{
        backgroundImage: `linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(16, 185, 129, 0.05)), url(https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
    }">
        <!-- header -->
        <div class="bg-white/95 backdrop-blur-md shadow-xl border-b border-gray-200 sticky top-0 z-10">
            <div class="max-w-6xl mx-auto px-6 py-6">
                <div class="flex items-center justify-between">
                    <div class="flex items-center">
                        <button @click="$inertia.visit('/')"
                            class="mr-4 p-3 text-gray-600 hover:text-blue-600 transition-colors rounded-full hover:bg-blue-50">
                            <ArrowLeft class="w-6 h-6" />
                        </button>
                        <div class="flex items-center gap-4">
                            <div
                                class="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                                <Bot class="w-9 h-9 text-white" />
                            </div>
                            <div>
                                <h1 class="text-3xl font-bold text-gray-800">Wezi Health Assistant</h1>
                                <p class="text-gray-600 flex items-center gap-2">
                                    <Sparkles class="w-4 h-4 text-blue-500" />
                                    {{t('greeting')}}
                                </p>
                            </div>
                        </div>

                    </div>
                    <div className="flex items-center gap-4">
                        <LanguageToggle />
                        <!-- <AccessibilityControls /> -->
                    </div>
                </div>
            </div>
        </div>

        <!-- quick questions -->
        <div class="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-24 z-10">
            <div class="max-w-6xl mx-auto px-6 py-6">
                <p class="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
                    <Sparkles class="w-4 h-4 text-blue-500" />
                    Quick Questions:
                </p>
                <div class="flex flex-wrap gap-3">
                    <button v-for="(q, index) in predefinedQuestions" :key="index" @click="handleQuickQuestion(q)"
                        class="px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm hover:bg-blue-100 transition-all duration-200 border border-blue-200 hover:border-blue-300 hover:shadow-md transform hover:scale-105">
                        {{ t(`quick_questions.${q}`) }}
                    </button>
                </div>
            </div>
        </div>

        <!-- messages -->
        <div ref="chatContainer" class="flex-1 max-w-6xl mx-auto w-full px-6 py-8 overflow-y-auto pb-40">
            <div class="space-y-8">
                <div v-for="msg in messages" :key="msg.id"
                    :class="['flex mb-4', msg.isUser ? 'justify-end' : 'justify-start']">
                    <div class="max-w-xs md:max-w-2xl flex items-start gap-4"
                        :class="msg.isUser ? 'flex-row-reverse' : 'flex-row'">
                        <div class="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg"
                            :class="msg.isUser
                                ? 'bg-gradient-to-br from-green-500 to-green-600'
                                : 'bg-gradient-to-br from-blue-500 to-blue-600'
                                ">
                            <component :is="getIcon(msg.isUser)" class="w-6 h-6 text-white" />
                        </div>
                        <div class="px-6 py-4 rounded-2xl shadow-lg backdrop-blur-sm border" :class="msg.isUser
                            ? 'bg-gradient-to-br from-green-500 to-green-600 text-white border-green-300'
                            : 'bg-white/95 text-gray-800 border-gray-200'
                            ">
                            <p class="text-sm leading-relaxed">{{ msg.text }}</p>
                            <p class="text-xs mt-3" :class="msg.isUser ? 'text-green-100' : 'text-gray-500'">
                                {{ msg.timestamp.toLocaleTimeString() }}
                            </p>
                        </div>
                    </div>
                </div>

                <div v-if="isTyping" class="flex justify-start animate-slide-up">
                    <div class="max-w-xs md:max-w-2xl flex items-start gap-4">
                        <div
                            class="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600">
                            <Bot class="w-6 h-6 text-white" />
                        </div>
                        <div
                            class="px-6 py-4 rounded-2xl shadow-lg bg-white/95 text-gray-800 border border-gray-200 backdrop-blur-sm">
                            <div class="flex items-center gap-1">
                                <div class="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
                                <div class="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                                    :style="{ animationDelay: '0.1s' }" />
                                <div class="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                                    :style="{ animationDelay: '0.2s' }" />
                            </div>
                        </div>
                    </div>
                </div>

                <!-- scroll sentel -->
                <div ref="messagesEndRef" class="h-px scroll-mb-40"></div>
            </div>
        </div>

        <!-- input -->
        <div class="bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-xl sticky bottom-0">
            <div class="max-w-6xl mx-auto px-6 py-6">
                <div class="flex gap-4">
                    <input v-model="inputText" @keydown.enter="sendMessage()" type="text"
                        :placeholder="$t('ask_question')"
                        class="flex-1 px-6 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm text-lg bg-white/90 backdrop-blur-sm" />
                    <button @click="sendMessage()" :disabled="!inputText.trim()"
                        class="px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105">
                        <Send class="w-6 h-6" />
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<!-- <script setup>
import LanguageToggle from '@/Components/LanguageToggle.vue'
import axios from 'axios'
import { ArrowLeft, Bot, BotIcon, Send, Sparkles, User } from 'lucide-vue-next'
import { reactive, ref, watch, nextTick } from 'vue'

import { useI18n } from 'vue-i18n'
import enMessages from '../locales/en/chatbot.json'
import frMessages from '../locales/fr/chatbot.json'



const predefinedQuestions = [
    'What are your visiting hours?',
    'How do I book an appointment?',
    'Where is the emergency room?',
    'What services do you offer?',
    'How do I get my test results?',
    'Do you accept insurance?'
]


const predefinedQuestion = ['visiting_hours', 'book_appointment', 'emergency_room']


const { t, locale, mergeLocaleMessage } = useI18n()
mergeLocaleMessage('en', enMessages)
mergeLocaleMessage('fr', frMessages)


const messages = reactive<[]>([
    {
        id: '1',
        text: "Hello! I'm your Wezi Medical Centre assistant. I'm here to help with your health questions and guide you through our services. What would you like to know?",
        isUser: false,
        timestamp: new Date()
    }
])

const messagesEndRef = ref<HTMLDivElement | null>(null)
const inputText = ref('')
const isTyping = ref(false)

// Auto scroll on new message
watch(
    () => messages.length,
    async () => {
        await nextTick()
        messagesEndRef.value?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
)

const addMessage = (text, isUser) => {
    messages.push({
        id: Date.now().toString(),
        text,
        isUser,
        timestamp: new Date()
    })
}

const sendMessage = async () => {
    if (!inputText.value.trim()) return

    const text = inputText.value
    addMessage(text, true)  // user's message
    inputText.value = ''
    isTyping.value = true

    try {
        const response = await axios.post(route('chatbot.ask'), { message: text })

        // Add bot response
        messages.push({
            id: (Date.now() + 1).toString(),
            text: response.data.answer,
            isUser: false,
            timestamp: new Date()
        })

    } catch (err) {
        console.error(err)
        messages.push({
            id: (Date.now() + 2).toString(),
            text: '⚠️ Something went wrong, please try again.',
            isUser: false,
            timestamp: new Date()
        })
    } finally {
        isTyping.value = false
    }
}


const handleQuickQuestion = (q) => {
    inputText.value = q
    sendMessage()
}

const getIcon = (isUser) => (isUser ? User : BotIcon)
</script> -->
<script setup>
import LanguageToggle from '@/Components/LanguageToggle.vue'
import axios from 'axios'
import { ArrowLeft, Bot, BotIcon, Send, Sparkles, User } from 'lucide-vue-next'
import { reactive, ref, watch, nextTick, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import enMessages from '../locales/en/chatbot.json'
import nyMessages from '../locales/ny/chatbot.json'

const { t, locale, mergeLocaleMessage } = useI18n()
mergeLocaleMessage('en', enMessages)
mergeLocaleMessage('ny', nyMessages)

// Reactive messages array
const messages = reactive([])

const initialGreeting = computed(() => ({
    id: '1',
    text: t('greeting'),
    isUser: false,
    timestamp: new Date()
}))

// Push greeting on mount
messages.push(initialGreeting.value)

// Watch locale changes to update the greeting dynamically
watch(locale, () => {
    messages[0].text = t('greeting')
})


const messagesEndRef = ref(null)
const inputText = ref('')
const isTyping = ref(false)

// Auto-scroll to last message
watch(
    () => messages.length,
    async () => {
        await nextTick()
        messagesEndRef.value?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
)

const addMessage = (text, isUser) => {
    messages.push({
        id: Date.now().toString(),
        text,
        isUser,
        timestamp: new Date()
    })
}

const sendMessage = async () => {
    if (!inputText.value.trim()) return

    const text = inputText.value
    addMessage(text, true)  // user's message
    inputText.value = ''
    isTyping.value = true

    try {
        const response = await axios.post(route('chatbot.ask'), { message: text })

        // Add bot response
        addMessage(response.data.answer, false)

    } catch (err) {
        console.error(err)
        addMessage('⚠️ Something went wrong, please try again.', false)
    } finally {
        isTyping.value = false
    }
}

const handleQuickQuestion = (key) => {
    // Use translated text
    const text = t(`quick_questions.${key}`)
    inputText.value = text
    sendMessage()
}

const getIcon = (isUser) => (isUser ? User : BotIcon)

// Quick question keys for translation
const predefinedQuestions = [
    'visiting_hours',
    'book_appointment',
    'emergency_room',
    'services_offered',
    'test_results',
    'insurance'
]
</script>