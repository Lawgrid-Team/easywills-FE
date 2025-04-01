import { Component, type OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Testimonial {
    id: number;
    quote: string;
    name: string;
    location: string;
    avatar: string;
}

interface Faq {
    question: string;
    answer: string;
}

@Component({
    selector: 'app-home',
    imports: [CommonModule, RouterModule],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
    activeTestimonial = 0;
    activeFaq: number | null = null;

    testimonials: Testimonial[] = [
        {
            id: 1,
            quote: 'The process was so simple and stress-free. I created my will in under 30 minutes and finally feel at peace knowing everything is taken care of.',
            name: 'Jane D.',
            location: 'From Toronto',
            avatar: 'svg/jane_d.svg',
        },
        {
            id: 2,
            quote: 'I loved how straightforward the steps were. The guidance provided at each stage was incredibly helpful!',
            name: 'Michael R.',
            location: 'From Calgary',
            avatar: 'svg/michael_r.svg',
        },
        {
            id: 3,
            quote: 'I was skeptical at first, but this platform made it easy to understand and customize my will. Highly recommended!',
            name: 'Ahmed S.',
            location: 'From Montreal',
            avatar: 'svg/ahmed_s.svg',
        },
        {
            id: 4,
            quote: 'The customer service team was exceptional. They answered all my questions promptly and professionally.',
            name: 'Sarah M.',
            location: 'From Vancouver',
            avatar: 'assets/images/placeholder.svg',
        },
        {
            id: 5,
            quote: 'As someone with a complex family situation, I appreciated how the platform handled all my specific needs.',
            name: 'David K.',
            location: 'From Ottawa',
            avatar: 'assets/images/placeholder.svg',
        },
    ];

    faqs: Faq[] = [
        {
            question: 'What is a Will?',
            answer: 'A Will is a legal document that outlines your wishes regarding the distribution of your assets and the care of any minor children after your death. It allows you to specify who will receive your property, who will be the guardian of your children, and who will manage your estate and carry out your wishes after your death.',
        },
        {
            question: 'Do I need a Lawyer to create a Will?',
            answer: "No, you don't necessarily need a lawyer to create a valid Will. Our platform provides a legally-binding document that meets all requirements in your jurisdiction. However, for complex estates or specific legal concerns, consulting with a lawyer may be beneficial.",
        },
        {
            question: 'Is this service suitable for all legal situations?',
            answer: 'Our service is designed to meet the needs of most individuals with straightforward estate planning needs. However, if you have a complex estate, significant assets, international property, or specific legal concerns, we recommend consulting with a legal professional for personalized advice.',
        },
        {
            question: 'Is my will legally binding?',
            answer: 'Yes, Wills created through our platform are legally binding as long as they are properly executed according to the laws in your jurisdiction. This typically involves signing the document in the presence of witnesses who also sign the Will. We provide clear instructions on how to properly execute your Will to ensure its validity.',
        },
        {
            question: 'How long does it take to create a will?',
            answer: 'Most users complete their Will in 20-30 minutes. Our step-by-step process guides you through all necessary decisions, making it quick and straightforward. You can also save your progress and return later if needed.',
        },
    ];

    get visibleTestimonials(): Testimonial[] {
        return [
            this.testimonials[this.activeTestimonial],
            this.testimonials[
                (this.activeTestimonial + 1) % this.testimonials.length
            ],
            this.testimonials[
                (this.activeTestimonial + 2) % this.testimonials.length
            ],
        ];
    }

    constructor() {}

    ngOnInit(): void {
        console.log('Home Component');
    }

    nextTestimonial(): void {
        this.activeTestimonial =
            this.activeTestimonial === this.testimonials.length - 1
                ? 0
                : this.activeTestimonial + 1;
    }

    prevTestimonial(): void {
        this.activeTestimonial =
            this.activeTestimonial === 0
                ? this.testimonials.length - 1
                : this.activeTestimonial - 1;
    }

    goToTestimonial(index: number): void {
        this.activeTestimonial = index;
    }

    toggleFaq(index: number): void {
        this.activeFaq = this.activeFaq === index ? null : index;
    }

    // Helper method to create an array for stars
    createRange(number: number): any[] {
        return new Array(number);
    }
}
