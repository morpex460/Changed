import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "Is this a course?",
      answer: (
      <div>
        <p>No, this is not a course.</p>
        <p> No one will teach you here what 'liquidity sweep' is, or what it isn't.This is a group where people focus on passing Prop Firm challenges and withdrawing profits, using strategies suggested in the video lessons.</p>
      </div>
    ),
  },
    {
      question: "What's the difference between Free and Full versions?",
       answer: (
      <div>
        <p>The free version is presented in the form of limited access to the group, it is only needed for a superficial understanding of further work, but does not give those knowledge, thanks to which it is possible to earn stably and without risks.</p>
        <p>The full version contains four proven and working strategies for passing challenges, two strategies for working on funded, as well as other nuances, thanks to which was able to earn on payouts already more than $100,000+ and don't lose money when I lose an account.</p>
      </div>
    ),
  },
    {
      question: "Will I trade in profit?",
      answer: (
      <div>
        <p>There is no goal in this.</p>
        <p>The group’s objective is not to teach you how to trade profitably on a personal account. The only goal is to ensure that when working with Prop accounts, you have minimal risks and maximum withdrawal amounts..</p>
      </div>
    ),
  },
    {
      question: "Will all the lessons be available right away?",
      answer: "The lessons are divided into 4 parts, each of which will be unlocked 2 days after the previous one. This is done so that you study the material as I initially intend and don’t rush. All lessons will be available within 8 days."
    },
    {
      question: "What is the payment method?",
      answer: "Payment is made in any cryptocurrency that is convenient for you."
    },
    {
      question: "Is there a refund?",
      answer: "A refund is possible before gaining access to the Discord group. Once access to Discord is granted, the service is considered fully rendered, and no refunds will be possible after joining."
    },
    {
      question: "How much money is needed to get started?",
      answer: (
      <div>
        <p>The price of the group is not set arbitrarily. It’s done so that you don’t join with your last money, because when people do that, they often make a lot of mistakes and take incorrect actions in an attempt to quickly get what they want.</p>
        <p>Also, based on my experience, for the first Funded account, you will need 3-4 challenges. This is because at the beginning, you will definitely make mistakes, I assure you. And often, these aren’t mistakes related to chart analysis, but purely technical ones (incorrect lot size calculation, wrong stop-loss, missing news, etc.).</p>
      </div>
    ),
  },
    {
      question: "Will there be signals/copy trading/bots, etc.?",
      answer: (
      <div>
        <p>If you’re really asking this question, please bypass this group. This is not for you. Everything is done manually and independently.</p>
        <p>I don't want to gather signal consumers whose only skill is pressing the Buy/Sell buttons without understanding what they're doing.</p> 
        <p>Look at the community as a place where you can find like-minded individuals, discuss the market, ask questions, and save yourself a couple of years of aimless searching.</p>
      </div>
    ),
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600">
            Answers to key questions about my trading strategy
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden"
            >
              <button
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-100 transition-colors"
                onClick={() => toggleFAQ(index)}
              >
                <span className="font-semibold text-gray-900">{faq.question}</span>
                {openIndex === index ? (
                  <ChevronUp className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                )}
              </button>
              {openIndex === index && (
                <div className="px-6 pb-4">
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

     
      </div>
    </section>
  );
};

export default FAQ;
