
"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { useLocale, useTranslations } from "next-intl";
import { useRouter, usePathname } from "next/navigation";

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function SettingsPage() {
    const t = useTranslations('SettingsPage');
    const { theme, setTheme } = useTheme();
    const [isPending, startTransition] = React.useTransition();
    const router = useRouter();
    const pathname = usePathname();
    const locale = useLocale();

    function onSelectLanguage(nextLocale: string) {
        startTransition(() => {
            router.replace(`/${nextLocale}${pathname}`);
        });
    }

    return (
        <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
            <div className="flex items-center gap-4">
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">{t('title')}</h2>
            </div>
           

            <div className="grid gap-8 md:grid-cols-3">
                <div className="md:col-span-2 grid gap-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('profileTitle')}</CardTitle>
                            <CardDescription>{t('profileDescription')}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">{t('nameLabel')}</Label>
                                <Input id="name" defaultValue="Alex Doe" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">{t('emailLabel')}</Label>
                                <Input id="email" type="email" defaultValue="alex.doe@example.com" />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="role">{t('roleLabel')}</Label>
                                <Select defaultValue="student">
                                    <SelectTrigger id="role">
                                        <SelectValue placeholder="Select role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="student">{t('roleStudent')}</SelectItem>
                                        <SelectItem value="professor">{t('roleProfessor')}</SelectItem>
                                        <SelectItem value="management">{t('roleManagement')}</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>{t('appearanceTitle')}</CardTitle>
                            <CardDescription>{t('appearanceDescription')}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="dark-mode">{t('themeLabel')}</Label>
                                <Select value={theme} onValueChange={setTheme}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Select theme" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="light">{t('themeLight')}</SelectItem>
                                        <SelectItem value="dark">{t('themeDark')}</SelectItem>
                                        <SelectItem value="system">{t('themeSystem')}</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex items-center justify-between">
                                <Label htmlFor="language">{t('languageLabel')}</Label>
                                <Select defaultValue={locale} onValueChange={onSelectLanguage}>
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Select language" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="en">English</SelectItem>
                                        <SelectItem value="ta">Tamil</SelectItem>
                                        <SelectItem value="hi">Hindi</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                             <div className="flex items-center justify-between">
                                <Label htmlFor="time-format">{t('timeFormatLabel')}</Label>
                                <Select defaultValue="12h">
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Select format" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="12h">{t('timeFormat12')}</SelectItem>
                                        <SelectItem value="24h">{t('timeFormat24')}</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                
                <div className="space-y-8">
                     <Card>
                        <CardHeader>
                            <CardTitle>{t('privacyTitle')}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                           <Button variant="outline" className="w-full">{t('exportDataButton')}</Button>
                           <Button variant="destructive" className="w-full">{t('deleteAccountButton')}</Button>
                        </CardContent>
                    </Card>

                     <Card>
                        <CardHeader>
                            <CardTitle>{t('resetTitle')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                           <Button variant="destructive" className="w-full">{t('resetButton')}</Button>
                           <p className="text-xs text-muted-foreground mt-2">{t('resetDescription')}</p>
                        </CardContent>
                    </Card>
                </div>

            </div>
            
            <div className="flex justify-end pt-4">
                <Button>{t('saveButton')}</Button>
            </div>
        </div>
    )
}
