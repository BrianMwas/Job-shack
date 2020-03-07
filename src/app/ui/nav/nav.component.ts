import { UserService } from './../../auth/user.service';
import { Job } from '../../shared/models/job';

import { Component, OnInit, Output, Inject, EventEmitter, Input } from "@angular/core";
import { NbSidebarService, NbSearchService, NbMenuService, NB_WINDOW, NbThemeService } from "@nebular/theme";
import { NbAuthJWTToken, NbAuthService, NbTokenService } from "@nebular/auth"
import { tap, filter, map } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from 'src/app/shared/models/user';
import { Observable } from 'rxjs';
@Component({
	selector: "app-navigation",
	templateUrl: './nav.component.html',
	styleUrls: ['./nav.component.scss']
})


export class NavigationComponent implements OnInit {
	public user: Observable<User>;
	userId: Observable<string>;
	@Output() loading: EventEmitter<boolean> = new EventEmitter<boolean>();
	@Output() searchResults: EventEmitter<Job[]> = new EventEmitter<Job[]>();

	searchTerm = '';

	items = [
		{
			title: 'Log out',
			icon: 'log-out-outline'
		}
	]

	@Input()
	loggedIn: boolean;
	profileDefined: boolean;
	darkMode: boolean = true;


	constructor (
		private sidebarService: NbSidebarService,
		private authService: NbAuthService,
		private searchService : NbSearchService,
		private userService: UserService,
    private router: Router,

		private nbMenuService: NbMenuService,
		@Inject(NB_WINDOW) private window,
    private nbTokenService: NbTokenService,
    public themeService: NbThemeService
		) { }

	ngOnInit() {

		this.authService.onTokenChange()
		.subscribe((token : NbAuthJWTToken) => {
			if(token.isValid()) {
				this.userId = token.getPayload()["userId"];

				this.userService.getAuthUser(this.userId)
				.subscribe(res => {
					this.user = res;
				})
			}
		});

		this.searchService.onSearchSubmit()
		.subscribe((data: any) => {
			this.searchTerm = data.term;
			this.router.navigate(['search'], { queryParams: { term: this.searchTerm }})
		})

		this.userService.getUserProfile(this.userId)
		.subscribe((profile: any) => {
			if(profile == undefined) {
				this.profileDefined = false;
			} else {
				this.profileDefined = true;
			}
		})


		this.nbMenuService.onItemClick()
		.pipe(
			filter(({ tag }) => tag === 'userMenu'),
			map(({ item: { title } }) => title)
		).subscribe(
			title =>  {
				this.authService.logout('email')
				this.nbTokenService.clear()
				this.router.navigate(['/'])
			}
		)
	}

	toggle() {
		this.sidebarService.toggle(false, "left")
  }

  toggleTheme() {
    if(this.darkMode) {
      this.themeService.changeTheme('default')
      this.darkMode = false
    } else {
      this.themeService.changeTheme('dark')
      this.darkMode = true
    }
  }
}

