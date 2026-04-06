import { Routes } from '@angular/router';
import { roleRedirectGuard } from './guards/role-redirect.guard';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';
import { LandingPageComponent } from './pages/landing-page.component';
import { LoginPageComponent } from './pages/login-page.component';
import { RegisterPageComponent } from './pages/register-page.component';
import { ForgotPasswordPageComponent } from './pages/forgot-password-page.component';
import { ResetPasswordPageComponent } from './pages/reset-password-page.component';
import { CitizenDashboardPageComponent } from './pages/citizen-dashboard-page.component';
import { SubmitComplaintPageComponent } from './pages/submit-complaint-page.component';
import { AdminDashboardPageComponent } from './pages/admin-dashboard-page.component';
import { OfficerDashboardPageComponent } from './pages/officer-dashboard-page.component';
import { ComplaintDetailsPageComponent } from './pages/complaint-details-page.component';
import { FeedbackPageComponent } from './pages/feedback-page.component';
import { AnalyticsDashboardComponent } from './modules/analytics/analytics-dashboard.component';

export const routes: Routes = [
	{ path: '', component: LandingPageComponent, pathMatch: 'full' },
	{ path: 'dashboard', canActivate: [roleRedirectGuard], component: LandingPageComponent },
	{ path: 'login', component: LoginPageComponent },
	{ path: 'register', component: RegisterPageComponent },
	{ path: 'forgot-password', component: ForgotPasswordPageComponent },
	{ path: 'reset-password', component: ResetPasswordPageComponent },
	{
		path: 'citizen',
		canActivate: [authGuard, roleGuard],
		data: { roles: ['CITIZEN'] },
		component: CitizenDashboardPageComponent
	},
	{
		path: 'submit',
		canActivate: [authGuard, roleGuard],
		data: { roles: ['CITIZEN'] },
		component: SubmitComplaintPageComponent
	},
	{
		path: 'my-complaints',
		canActivate: [authGuard, roleGuard],
		data: { roles: ['CITIZEN'] },
		component: CitizenDashboardPageComponent
	},
	{
		path: 'admin',
		canActivate: [authGuard, roleGuard],
		data: { roles: ['ADMIN'] },
		component: AdminDashboardPageComponent
	},
	{
		path: 'analytics',
		canActivate: [authGuard, roleGuard],
		data: { roles: ['ADMIN'], role: 'ADMIN' },
		component: AnalyticsDashboardComponent
	},
	{
		path: 'officer-analytics',
		canActivate: [authGuard, roleGuard],
		data: { roles: ['OFFICER'], role: 'OFFICER' },
		component: AnalyticsDashboardComponent
	},
	{
		path: 'officer',
		canActivate: [authGuard, roleGuard],
		data: { roles: ['OFFICER'] },
		component: OfficerDashboardPageComponent
	},
	{
		path: 'complaints/:id',
		canActivate: [authGuard, roleGuard],
		data: { roles: ['CITIZEN', 'ADMIN', 'OFFICER'] },
		component: ComplaintDetailsPageComponent
	},
	{
		path: 'feedback/:id',
		canActivate: [authGuard, roleGuard],
		data: { roles: ['CITIZEN'] },
		component: FeedbackPageComponent
	},
	{ path: '**', redirectTo: '' }
];
