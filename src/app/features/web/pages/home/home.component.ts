import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Testimonial {
    id: number;
    quote: string;
    name: string;
    location: string;
    avatar: string;
}

@Component({
    selector: 'app-home',
    imports: [CommonModule, RouterModule],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
    activeTestimonial = 0;

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

    // Helper method to create an array for stars
    createRange(number: number): any[] {
        return new Array(number);
    }
}
