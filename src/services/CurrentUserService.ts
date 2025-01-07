import Container, { Service } from "typedi";
import { JwtPayload } from "../models/jwtPayloadModel";

@Service()
export class CurrentUserService {
    key = '_____CURRENT_USER_____';
    setCurrentUser(user: JwtPayload): void {
        Container.set(this.key, user);
    }
	getCurrentUser(): JwtPayload | null {
		return Container.has<JwtPayload>(this.key)
			? Container.get<JwtPayload>(this.key)
			: null;
	}
}
