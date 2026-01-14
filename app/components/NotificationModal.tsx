'use client'

import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { CheckCircleIcon, XCircleIcon, InformationCircleIcon, XMarkIcon } from '@heroicons/react/24/outline'

export type NotificationType = 'success' | 'error' | 'info'

interface Props {
  isOpen: boolean
  onClose: () => void
  type: NotificationType
  title: string
  message: string
}

export default function NotificationModal({ isOpen, onClose, type, title, message }: Props) {
  const icons = {
    success: <CheckCircleIcon className="w-12 h-12 text-green-500" />,
    error: <XCircleIcon className="w-12 h-12 text-red-500" />,
    info: <InformationCircleIcon className="w-12 h-12 text-blue-500" />
  }

  const bgColors = {
    success: 'bg-green-50',
    error: 'bg-red-50',
    info: 'bg-blue-50'
  }

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[100]" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-brand-dark/20 backdrop-blur-md transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-[2.5rem] bg-white p-8 text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-sm border border-gray-100">
                <div className="absolute right-6 top-6">
                  <button
                    type="button"
                    className="rounded-full bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
                    onClick={onClose}
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="flex flex-col items-center text-center">
                  <div className={`mx-auto flex h-24 w-24 items-center justify-center rounded-full ${bgColors[type]} mb-6`}>
                    {icons[type]}
                  </div>
                  
                  <Dialog.Title as="h3" className="text-xl font-black uppercase tracking-tighter text-brand-dark mb-4">
                    {title}
                  </Dialog.Title>
                  
                  <div className="mt-2">
                    <p className="text-gray-500 text-sm leading-relaxed whitespace-pre-line">
                      {message}
                    </p>
                  </div>
                </div>

                <div className="mt-8">
                  <button
                    type="button"
                    className="w-full h-14 bg-brand-dark text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.25em] shadow-xl hover:bg-black transition-all transform hover:scale-105"
                    onClick={onClose}
                  >
                    Đã hiểu
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
